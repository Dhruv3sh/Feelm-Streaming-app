import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ColumnCards from "../components/Cards/ColumnCards";
import { Helmet } from "react-helmet";

const ExplorePage = () => {
  const params = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [movieData, setMoviesData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchData = async () => {
    try {
      const response = await axios.get(`/discover/${params.explore}`, {
        params: {
          page: pageNo,
        },
      });

      if (params.explore === "movie") {
        setMoviesData((prevData) => {
          const newData = response.data.results.filter(
            (newItem) =>
              !prevData.some((prevItem) => prevItem.id === newItem.id)
          );
          return [...prevData, ...newData];
        });
      } else if (params.explore === "tv") {
        setTvData((prevData) => {
          const newData = response.data.results.filter(
            (newItem) =>
              !prevData.some((prevItem) => prevItem.id === newItem.id)
          );
          return [...prevData, ...newData];
        });
      }
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
      setPageNo((prevPageNo) => ++prevPageNo);
    }
  };

  useEffect(() => {
    if (pageNo > 1) {
      setLoading(true); // Start loading only when pageNo > 1
    }

    const delayFetch = setTimeout(
      () => {
        fetchData();
      },
      pageNo > 1 ? 500 : 0
    );

    return () => clearTimeout(delayFetch);
  }, [pageNo]);

  useEffect(() => {
    fetchData();
  }, [params.explore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="py-16 min-h-screen">
      <Helmet>
        <title>
          Explore Popular {params.explore === "movie" ? "Movies" : "TV Shows"} |
          Feelm Movies
        </title>
        <meta
          name="description"
          content={`Discover trending ${params.explore} content, only on Feelm Movies. Browse top-rated titles now!`}
        />
        <meta name="google-site-verification" content="Xm_T86JyHrfix5en8SzyXQM7MlORy-Zh04DxdyuwDIU" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://feelmmovies.vercel.app/${params.explore}`}
        />
      </Helmet>

      <div>
        <h3 className="capitalize text-lg lg:text-xl font-semibold mx-1 my-2 md:mx-2 md:my-3 3xl:mt-10">
          Popular {params.explore}
        </h3>

        {params.explore === "movie" ? (
          <ColumnCards data={movieData} mediaType={"movie"} />
        ) : (
          <ColumnCards data={tvData} mediaType={"tv"} />
        )}

        <div className="min-h-16">
          {loading && (
            <div className="flex justify-center items-center pt-3">
              <div className="animate-spinner-linear-spin rounded-full h-10 w-10 border-t-3 border-blue-500 border-solid"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
