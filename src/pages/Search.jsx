import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ColumnCards from "../components/Cards/ColumnCards";

const Search = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Track if there is more data to fetch
  const navigate = useNavigate();

  const query = location?.search?.slice(3);

  const fetchData = async (reset = false) => {
    if (loading || !query) return; // Prevent fetching if already loading or no query
    setLoading(true);
    try {
      const response = await axios.get(`/search/multi`, {
        params: {
          query,
          page,
        },
      });

      // Simulate delay for better UX
      setTimeout(() => {
        const results = response.data.results;
        setData((prev) => (reset ? results : [...prev, ...results]));
        setHasMore(results.length > 0);
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setPage(1);
      setData([]);
      fetchData(true); // Reset data for new query
    }
  }, [query]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      hasMore &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
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
    <div className="bg-zinc-950 text-neutral-300 py-16 min-h-[100vh] 3xl:pt-40">
      <div className="lg:hidden mx-1 my-1">
        <input
          type="text"
          placeholder="Search Here....."
          value={query?.split("%20")?.join(" ")}
          onChange={(e) => navigate(`/search?q=${e.target.value}`)}
          className="rounded-full w-full px-4 py-1 bg-neutral-300 text-black"
        />
      </div>
      <div>
          {query.length > 0 && data.length > 0 ? (
            <ColumnCards data={data}/>
          ) : !loading && query.length === 0 ? (
            <div className=" w-full flex justify-center col-span-5 sm:col-span-9 pt-16 text-2xl max-sm:text-base ">
              <p>Search Here your favourite movie or show...</p>
            </div>
          ) : null }
          {!loading && query.length > 0 && data.length === 0 ? <div className=" w-full flex justify-center col-span-5 sm:col-span-9 pt-16 text-2xl max-sm:text-base ">
          <p>No Result Found...</p>
        </div> : null }
        </div>
        {loading && (
          <div className="col-span-5 flex justify-center items-center pt-8">
            <div className="flex justify-center items-center pt-3">
              <div className="animate-spinner-linear-spin rounded-full h-10 w-10 border-t-3 border-blue-500 border-solid"></div>
            </div>
          </div>
        )}
      </div>
  );
};

export default Search;
