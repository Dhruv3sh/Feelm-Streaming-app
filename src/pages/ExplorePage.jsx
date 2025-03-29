import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
      <div>
        <h3 className="capitalize text-lg lg:text-xl font-semibold mx-1 my-2 md:mx-2 md:my-3">
          Popular {params.explore}
        </h3>

        {params.explore === "movie" ? (
          <div className="m-1 md:m-2 grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-[0.4rem] sm:grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
            {movieData?.map((exploreData, index) => {
              const imgPath =
                exploreData?.poster_path || exploreData?.backdrop_path;
              if (!imgPath) return null;
              return (
                <Link to={`/movie/${exploreData?.id}`} key={index}>
                  <img
                    src={`https://image.tmdb.org/t/p/w342${imgPath}`}
                    alt="poster"
                    className={`hover:scale-[1.01] transition-all duration-200 ease-in-out"
                    `}
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className=" m-1 grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2 sm:grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
            {tvData?.map((exploreData, index) => {
              const imgPath =
                exploreData?.poster_path || exploreData?.backdrop_path;
              if (!imgPath) return null;
              return (
                <Link to={`/tv/${exploreData?.id}`} key={index}>
                  <img
                    src={`https://image.tmdb.org/t/p/w342${imgPath}`}
                    alt="poster"
                    className={`hover:scale-[1.01] transition-all duration-200 ease-in-out "
                    }`}
                  />
                </Link>
              );
            })}
          </div>
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
