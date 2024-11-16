import { useEffect, useState } from "react";

import axios from "axios";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../components/Firebase";


const useFetch = (endpoint, firebaseFetch = false, user = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (firebaseFetch && user) {
        // Firestore fetch logic for wishlist
        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setData(userData?.wishlist || []);
          } else {
            setData([]);
          }
          setLoading(false);
        });

        return () => unsubscribe(); // Cleanup on unmount or user change
      } else {
        // Axios fetch logic for API calls
        try {
          const response = await axios.get(endpoint);
          setData(response?.data?.results || []);
        } catch (error) {
          console.log("Error fetching data:", error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, firebaseFetch, user]);

  return { data, loading };
};

export default useFetch;
