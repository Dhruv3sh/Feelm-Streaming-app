import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Loader from "../components/Loader";

const ExplorePage = () => {
  const params = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchData = async () => {
    try {
      const response = await axios.get(`/discover/${params.explore}`, {
        params: {
          page: pageNo,
        },
      });

      setData((prevData) => {
        const newData = response.data.results.filter(
          (newItem) => !prevData.some((prevItem) => prevItem.id === newItem.id)
        );
        return [...prevData, ...newData];
      });

      setTotalPageNo(response.data.total_pages);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      setPageNo((prevPageNo) => prevPageNo + 1);
    }
  };

  useEffect(() => {
    if (pageNo > 1) {
      setLoading(true); // Start loading only when pageNo > 1
    }
    
    const delayFetch = setTimeout(() => {
      fetchData();
    }, pageNo > 1 ? 1000 : 0);

    return () => clearTimeout(delayFetch);
  }, [pageNo]);

  useEffect(() => {
    setPageNo(1);
    setData([]);
    fetchData();
  }, [params.explore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="py-16">
      <div >
        <h3 className="capitalize text-lg lg:text-xl font-semibold my-3 max-sm:ml-2 max-lg:ml-9 lg:ml-5
        ">
          Popular {params.explore}
        </h3>

        <div className=" m-1 grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
          {data.map((exploreData, index) => (      
              <Card
              data={exploreData}
              key={exploreData.id + "exploreSEction" + index}
              media_type={params.explore}
            />
                    
          ))}
        </div>
        <div className="min-h-16">
        {loading && <Loader/>}
        </div>    
      </div>
    </div>
  );
};

export default ExplorePage;
