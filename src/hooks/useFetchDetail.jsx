import axios from "axios";
import { useEffect, useState } from "react";

const useFetchDetail = (endpoint) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint);
        setData(response?.data);
      } catch (error) {
        console.log("err", error);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data };
};

export default useFetchDetail;
