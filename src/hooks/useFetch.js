import { useEffect, useState } from "react";

import axios from "axios";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../components/Firebase";

const useFetch = (endpoint, firebaseFetch = false, user = null, collection = "wishlist") => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (firebaseFetch) {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const unsubscribe = onSnapshot(
            userRef,
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setData(userData?.[collection] || []);
              } else {
                setData([]);
              }
              setLoading(false);
            },
            (error) => {
              console.error(`Error fetching Firebase ${collection} data:`, error);
              setError(`Failed to fetch ${collection} data from Firebase.`);
              setLoading(false);
            }
          );
          return () => unsubscribe(); // Cleanup
        } else {
          setData([]);
          setLoading(false);
        }
      } else if (endpoint) {
        try {
          const response = await axios.get(endpoint);
          setData(response?.data?.results || []);
        } catch (error) {
          console.error("Error fetching API data:", error);
          setError("Failed to fetch data.");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [firebaseFetch, user, collection]);

  return { data, loading, error };
};

export default useFetch;
