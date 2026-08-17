import { useEffect, useState } from "react";

const useFetch = (firebaseFetch = false, user = null, collection) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseFetch || !user) {
      setData([]);
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};
    let isActive = true;

    setLoading(true);
    Promise.all([
      import("firebase/firestore"),
      import("../components/firebase/firebaseDb"),
    ]).then(([{ doc, onSnapshot }, { db }]) => {
      if (!isActive) return;

      const userRef = doc(db, "users", user.uid);
      unsubscribe = onSnapshot(
        userRef,
        (docSnapshot) => {
          const newData = docSnapshot.exists() ? docSnapshot.data()?.[collection] || [] : [];
          if(collection === "CurrentlyWatching"){
            setData((prev) => (JSON.stringify(prev) === JSON.stringify(newData) ? [...prev].reverse() : [...newData].reverse()));
          }else{
            setData((prev) => (JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData));
          }
          setLoading(false);
        },
        (error) => {
          console.error(`Error fetching ${collection} data:`, error);
          setLoading(false);
        }
      );
    });

    return () => {
      isActive = false;
      unsubscribe();
    }; // Cleanup on unmount or dependency change
  }, [firebaseFetch, user, collection]);

  return { data, loading };
};

export default useFetch;
