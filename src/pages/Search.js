import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";

const Search = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const query = location?.search?.slice(3);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/search/multi`, {
        params: {
          query: location?.search?.slice(3),
          page: page,
        },
      });

      setData((preve) => {
        return [...preve, ...response.data.results];
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (query) {
      setPage(1);
      setData([]);
      fetchData();
    }
  }, [location?.search]);

  const handleScroll = useCallback(() => {
    const debounceTimeout = 500;
    let timeoutId;

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setPage((preve) => preve + 1);
      }
    }, debounceTimeout);
  }, []);

  useEffect(() => {
    if (query) {
      fetchData();
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className=" bg-zinc-950 text-neutral-300 py-16 min-h-[94vh] ">
      <div className=" lg:hidden mx-1 my-1">
        <input
          type="text"
          placeholder="Search Here....."
          value={query?.split("%20")?.join(" ")}
          onChange={(e) => navigate(`/search?q=${e.target.value}`)}
          className="rounded-full w-full px-4 py-1 bg-neutral-300 text-black"
        ></input>
      </div>
      <div className=" container mx-auto">
        <h3 className=" capitalize pl-2 text-lg lg:text-xl font-semibold my-3">
          search Result
        </h3>
        <div className="grid grid-cols-5 pl-2 gap-y-4 lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-3 max-sm:grid-cols-2">
          {data.map((searchData, index) => {
            return (
              <Card
                data={searchData}
                key={searchData.id + "search" + index}
                media_type={searchData.media_type}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;
