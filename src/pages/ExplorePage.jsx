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
    <div className="bg-zinc-950 min-h-screen pt-16">
      <div className="container mx-auto">
        <h3 className="capitalize text-lg lg:text-xl font-semibold my-3 pl-3 md:pl-6">
          Popular {params.explore}
        </h3>

        <div className=" md:grid md:grid-cols-5 pl-2 md:pl-6 md:gap-y-5 lg:grid-cols-4 xl:grid-cols-5 flex gap-[4px] flex-wrap justify-center -gap-y-1">
          {data.map((exploreData, index) => (      
              <Card
              data={exploreData}
              key={exploreData.id + "exploreSEction" + index}
              media_type={params.explore}
            />
                    
          ))}
        </div>

        {loading && <Loader/>}
      </div>
    </div>
  );
};

export default ExplorePage;
