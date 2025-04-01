import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../components/Firebase";

const useFetch = (firebaseFetch = false, user = null, collection = "wishlist") => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseFetch || !user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        const newData = docSnapshot.exists() ? docSnapshot.data()?.[collection] || [] : [];
        setData((prev) => (JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData));
        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching ${collection} data:`, error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount or dependency change
  }, [firebaseFetch, user?.uid, collection]);

  return { data, loading };
};

export default useFetch;
