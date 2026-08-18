import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFetchDetail from "../hooks/useFetchDetail";
import moment from "moment/moment";
import CardRow from "../components/Cards/CardRow";
import Loading from "../components/Loaders/Loading";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { auth } from "../components/firebase/firebaseAuth";
import { db } from "../components/firebase/firebaseDb";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { MdPlaylistAdd } from "react-icons/md";
import { MdPlaylistAddCheck } from "react-icons/md";
import { MdPlayArrow } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import TrailerComponent from "../components/TrailerComponent";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { fetchRecommendations } from "../store/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import axios from "axios";

const DetailPage = () => {
  const { state } = useLocation();
  const { explore, id } = useParams();
  const { data } = useFetchDetail(`/${explore}/${id}`);
  const { data: castData } = useFetchDetail(`/${explore}/${id}/credits`);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { recommended, similar } = useSelector((state) => state.MoviesAndShows);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCurrentWatchList, setInCurrentWatchList] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [episodesData, setEpisodesData] = useState(null);
  const [isEpisodesLoading, setIsEpisodesLoading] = useState(false);

  /** For Seo */
  const title = state?.title || state?.name;
  const description =
    data?.overview || state?.overview || "Watch movies and TV shows online.";
  const poster_path =
    "https://image.tmdb.org/t/p/w780"+(state?.poster_path || state?.backdrop_path);
  const pageUrl = `https://feelmmovies.vercel.app/${explore}/${id}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": explore === "movie" ? "Movie" : "TVSeries",
    name: title,
    description: description,
    image: poster_path,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: state?.vote_average,
      ratingCount: state?.vote_count,
    },
  };
  // console.log(title,description,structuredData);

  useEffect(() => {
    if (explore && id) {
      dispatch(fetchRecommendations({ explore, id }));
    }
  }, [dispatch, explore, id]);

  const duration = (data?.runtime / 60).toFixed(1).split(".");

  //fetch userlist
  useEffect(() => {
    const fetchUserLists = async () => {
      if (auth?.currentUser) {
        const userRef = doc(db, "users", auth?.currentUser?.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData) {
          setInWishlist(
            userData?.wishlist?.some((item) => item?.id === state?.id)
          );
          setInCurrentWatchList(
            userData.CurrentlyWatching?.some((item) => item?.id === state?.id)
          );
        }
      }
    };

    fetchUserLists();
  }, [state?.id, inCurrentWatchList]);

  // Add to Wishlist
  const handleAddToWishlist = async () => {
    if (!auth.currentUser) {
      toast.dismiss();
      toast.warning("Please log in to add to your wishlist.", {
        position: "top-center",
        theme: "dark",
        autoClose: 1200,
      });
      return;
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    const item = {
      id: state?.id,
      title: state?.title || state?.name,
      poster_path: `${state?.poster_path}`,
      media_type: explore,
      release_date: state?.release_date || state?.first_air_date,
      vote_average: state?.vote_average,
      backdrop_path: state?.backdrop_path || state?.poster_path,
      vote_count: state?.vote_count,
      overview: state?.overview,
      genres: data?.genres,
      duration: `${duration?.[0]}h ${duration?.[1]}m`,
    };

    try {
      await updateDoc(userRef, {
        wishlist: arrayUnion(item),
      });
      setInWishlist(true);
      toast.dismiss();
      toast.success("Added to Wishlist!", {
        position: "top-center",
        theme: "dark",
        autoClose: 1200,
      });
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to add to Wishlist.", {
        position: "top-center",
        theme: "dark",
        autoClose: 1200,
      });
      console.error("Error adding to wishlist:", error);
    }
  };

  // Remove from Wishlist
  const handleRemoveFromWishlist = async (event) => {
    event.stopPropagation();
    if (!auth.currentUser) {
      toast.dismiss();
      toast.warning("Please log in to access your wishlist.", {
        position: "top-center",
        theme: "dark",
        autoClose: 1200,
      });
      return;
    }
    const userRef = doc(db, "users", auth.currentUser.uid);

    try {
      // Fetch the current wishlist
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const wishlist = userData?.wishlist || [];

        // Filter out the item to be removed
        const updatedList = wishlist.filter((item) => item.id !== state.id);

        // Update the wishlist list in Firestore
        await updateDoc(userRef, {
          wishlist: updatedList,
        });
        setInWishlist(false);
        toast.dismiss();
        toast.success("Removed from Wishlist!", {
          position: "top-center",
          theme: "dark",
          autoClose: 1200,
        });
      } else {
        toast.error("item does not exist", {
          position: "top-center",
          theme: "dark",
          autoClose: 1200,
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to remove from Wishlist.", {
        position: "top-center",
        theme: "dark",
        autoClose: 1200,
      });
    }
  };

  //play button
  const handlePlayBtn = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const item = {
        id: state?.id,
        title: state?.title || state?.name,
        poster_path: `${state?.poster_path}`,
        media_type: explore,
        release_date: state?.release_date || state?.first_air_date,
        vote_average: state?.vote_average,
        backdrop_path: state?.backdrop_path || state?.poster_path,
        vote_count: state?.vote_count,
        overview: state?.overview,
        genres: data?.genres,
        duration: `${duration?.[0]}h ${duration?.[1]}m`,
      };

      try {
        // Fetch the current list
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const currentlyWatching = userData?.CurrentlyWatching || [];

          // Check if the item is already in the list
          const isInList = currentlyWatching.some(
            (currentItem) => currentItem.id === item.id
          );

          if (!isInList) {
            // Add to Currently Watching if not in the list
            await updateDoc(userRef, {
              CurrentlyWatching: arrayUnion(item),
            });
          }

          // Navigate to the player
          if(explore === "movie"){
            Navigate(`/player/${explore}/${id}`);
          }else{
            Navigate(`/player/${explore}/${id}?s=${currentSeason}&e=1`);
          }
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error updating Currently Watching:", error);
      }
    } else {
      toast.dismiss();
      toast.warning("Login or signup to Play now", {
        position: "top-center",
        theme: "dark",
        autoClose: 1200,
      });
    }
  };

  //Episodes
  useEffect(()=>{
    const fetchEpisodes = async() =>{
      if (explore !== "tv" || !id || !currentSeason) return;

      setIsEpisodesLoading(true);
      try {
        const episodes = await axios.get(`/tv/${id}/season/${currentSeason}?language=en-US`);
        setEpisodesData(episodes?.data);
      } catch (error) {
        console.log(error);
        setEpisodesData(null);
      } finally {
        setIsEpisodesLoading(false);
      }
    };
    fetchEpisodes();
  },[explore,id,currentSeason])

  const handleEpisodes = (episode) =>{
    Navigate(`/player/${explore}/${id}?s=${currentSeason}&e=${episode.episode_number}`);
  };

  const validCast = castData?.cast?.filter((image) => image?.profile_path) || [];
  const initialItemsCount = 8;
  const displayedCast = isExpanded ? validCast : validCast.slice(0, initialItemsCount);
  const seasons = data?.seasons?.filter((items)=> items.name !== "Specials") || [];
  const episodes = episodesData?.episodes || [];

  return (
    <>
      <div className="w-full h-[360px] relative">
        <Helmet>
          <title>{title} | FeelmMovies</title>
          <meta name="description" content={description} />
          <meta
            name="keywords"
            content={`${title}`}
          />
          <meta name="google-site-verification" content="Xm_T86JyHrfix5en8SzyXQM7MlORy-Zh04DxdyuwDIU" />
          <meta property="og:title" content={`${title} | FeelmMovies`} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={poster_path} />
          <meta property="og:type" content="video.movie" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${title} | FeelmMovies`} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={poster_path} />
          <link rel="canonical" href={pageUrl} />
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Helmet>

        <div className="h-full w-full relative">
          {!isLoaded && <Loading />}
          {state ? (
            <img
              src={
                "https://image.tmdb.org/t/p/w780" + state?.backdrop_path ||
                state?.poster_path
              }
              onLoad={() => setIsLoaded(true)}
              alt="poster"
              className={`h-full w-full object-cover transition-all ease-in-out ${
                isLoaded ? " opacity-100" : " opacity-0"
              }`}
            />
          ) : (
            <Loading />
          )}
          <DotLottieReact
            className="absolute top-1/2 left-[39%] sm:left-[48%] h-[3.5rem] w-[6.2rem] z-20 hover:cursor-pointer"
            src="https://lottie.host/2fec7c05-8d01-4b7a-b39e-b2ce52b993f8/PGKNafYbKq.lottie"
            loop
            autoplay
            onClick={() => setShowTrailer(true)}
          />
          <span className="absolute top-[63%] left-[40%] sm:left-[48%] sm:pl-2 ">
            Watch Trailer
          </span>
        </div>
        {showTrailer && (
          <TrailerComponent
            showTrailer={showTrailer}
            setShowTrailer={setShowTrailer}
            movieTitle={state?.title || state?.name}
          />
        )}

        <div className=" absolute w-full h-full top-0 bg-gradient-to-t from-zinc-950/100 to-transparent"></div>
      </div>
      <div className=" px-4 py-1 md:py-0 flex flex-col md:flex-row gap-5 lg:gap-8">
        <div className=" relative mx-auto md:mx-0 md:-mt-24 lg:-mt-36 w-64 min-w-60 max-lg:min-w-52 hidden md:block">
          {state?.poster_path ? (
            <img
              src={"https://image.tmdb.org/t/p/w300" + state?.poster_path}
              onLoad={() => setIsProfileLoaded(true)}
              alt="banner"
              className={`mih-h-80 object-cover transition-opacity rounded-md ease-in-out ${
                isProfileLoaded ? " opacity-100" : " opacity-0"
              }`}
            />
          ) : (
            <Card className="w-[240px] " radius="sm">
              <Skeleton className="rounded-sm">
                <div className=" h-[360px] rounded-lg transition-all bg-default-300"></div>
              </Skeleton>
            </Card>
          )}

          <div className="flex w-full">
            <button
              className=" bg-white w-[200px] px-1 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-orange-600 to-yellow-300 shadow-md active:scale-75 hover:scale-105 transition-all "
              onClick={handlePlayBtn}
            >
              Play now
            </button>
            {inWishlist ? (
              <button
                onClick={handleRemoveFromWishlist}
                className="pl-2 pt-4 text-white rounded relative active:scale-95 group"
              >
                <MdPlaylistAddCheck size={34} />
              </button>
            ) : (
              <button
                onClick={handleAddToWishlist}
                className="pl-2 pt-4 text-white rounded relative active:scale-95 group"
              >
                <MdPlaylistAdd size={34} />
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="flex gap-2 max-[320px]:text-center ">
            <h2 className=" text-2xl md:text-3xl lg:text-4xl font-bold text-white pt-2 pb-2">
              {state?.title || state?.name}
            </h2>
          </div>

          <p className=" capitalize text-neutral-400 ">{state?.tagline}</p>
          <div className="flex items-center my-3 gap-2 font-thin max-[320px]:text-center">
            <p>
              <b>Rating :</b> {Number(state?.vote_average).toFixed(1)}
            </p>

            <span>|</span>
            <p>
              <b>Views : </b>
              {Number(state?.vote_count)}
            </p>

            {explore === "movie" ? (
              <>
                <span>|</span>
                <p>
                  <b>Duration : </b>
                  {duration?.[0]}h {duration?.[1]}m
                </p>
              </>
            ) : (
              ""
            )}
          </div>

          {/* For mobile view */}
          <div className="flex w-full justify-center">
            <button
              className=" hidden bg-white w-80 h-10 px-4 py-4 text-black font-bold rounded mt-1 hover:bg-gradient-to-l from-orange-600 to-yellow-300 shadow-md transition-all max-md:px-1 max-md:py-1 max-md:block "
              onClick={handlePlayBtn}
            >
              Play now
            </button>
            {inWishlist ? (
              <button
                onClick={handleRemoveFromWishlist}
                className="pl-4 pt-1 text-white rounded relative active:scale-95 hidden max-md:block"
              >
                <FaCheck size={24} />
              </button>
            ) : (
              <button
                onClick={handleAddToWishlist}
                className="pl-4 pt-1 text-white rounded relative active:scale-95 hidden max-md:block"
              >
                <FaPlus size={24} />
              </button>
            )}
          </div>
          <div>
            <p className=" border-b-1 border-neutral-800 my-2 "></p>
            <h3 className=" text-xl font-bold text-white mb-1">Overview </h3>
            <p>{data.overview}</p>
            <p className=" border-b-1 border-neutral-800 my-2 "></p>
            <div className=" flex flex-row gap-[4px] font-thin pt-1 max-[320px]:text-center">
              <h4>
                <b>Genre:</b>
              </h4>
              <p> {data?.genres?.[0]?.name}</p>
              <span
                className={`${
                  data?.genres?.[1]?.name === undefined ? "hidden" : "inline"
                }`}
              >
                |
              </span>
              <p>{data?.genres?.[1]?.name}</p>
            </div>
            <p className=" border-b-1 border-neutral-800 my-2 "></p>
            <div className=" flex flex-row max-[370px]:flex-col gap-1 font-thin py-1 max-[320px]:gap-1">
              <p>
                <b>Date :</b>{" "}
                {moment(state?.release_date).format("MMM Do YYYY")}
              </p>
            </div>
          </div>
          <div
            className={`${castData?.crew?.length === 0 ? "hidden" : "block"}`}
          >
            <p className=" border-b-1 border-neutral-800 my-2 "></p>
            <p>
              <span>Director</span> :{" "}
              {castData?.crew?.find((member) => member.job === "Director")
                ?.name ||
                castData?.crew?.find((member) => member.job === "Producer")
                  ?.name}
            </p>
          </div>
          <div
            className={`${castData?.cast?.length === 0 ? "hidden" : "block"}`}
          >
            <p className=" border-b-1 border-neutral-800 my-2 "></p>
            <h2 className=" font-bold text-lg">Cast : </h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 ">
            {displayedCast.map((starCast, index) => {
                return (
                  <div key={index}>
                    <div>
                      {/* Skeleton loader while the image is loading */}
                      {!isProfileLoaded && (
                        <div>
                          <Skeleton className="rounded-full w-20 h-20" />
                        </div>
                      )}

                      {starCast?.profile_path ? (
                        <img
                          src={
                            "https://image.tmdb.org/t/p/w300" +
                            starCast.profile_path
                          }
                          onLoad={() => setIsProfileLoaded(true)}
                          alt="Profile"
                          className={` mx-auto w-20 h-20 object-cover rounded-full transition-opacity duration-300  ${
                            isProfileLoaded ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      ) : (
                        //Skeleton loader if profile_path is not available
                        <div>
                          <Skeleton className="rounded-full w-20 h-20" />
                        </div>
                      )}
                    </div>
                    <p className=" font-thin text-sm text-center">
                      {starCast?.name}
                    </p>
                  </div>
                );
              })}
          </div>
          {validCast.length > initialItemsCount && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 font-semibold text-sm self-start hover:underline mt-2"
            >
              {isExpanded ? "Show less..." : "Show more..."}
            </button>
          )}
        </div>
      </div>

      {seasons.length > 0 && (
      <div className="px-3 my-10 box-border">
        <h2 className="text-white text-2xl max-md:text-xl font-bold mb-5 border-l-4 border-l-red-700 pl-4">Episodes</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {seasons.map((items)=>{
            const isActive = currentSeason === items.season_number;
            return(
              <button key={items.name} onClick={() => setCurrentSeason(items.season_number)} className={`shrink-0 px-5 py-3 rounded-lg border text-sm font-bold transition-colors ${
                isActive 
                  ? "bg-orange-600 border-orange-500 text-white" 
                  : "bg-[#171821] border-[#292a37] text-gray-300 hover:border-orange-600 hover:text-white"
              }`}>{items.name}
              </button>
            ) 
          })}
        </div>
        <div className="mt-5 max-h-[36rem] overflow-y-auto pr-1">
          {isEpisodesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-[7.8rem] rounded-lg border border-[#292a37] bg-[#171821] animate-pulse"></div>
              ))}
            </div>
          ) : episodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {episodes.map((episode) => {
                const isActive = 1 === episode.episode_number;
                return (
                  <div key={episode.id} onClick={()=>handleEpisodes(episode)} className={`group flex items-center gap-3 rounded-lg border  bg-[#171821] p-3 min-h-[7.8rem] transition-colors hover:border-orange-600 ${isActive ? "border-orange-600": "border-[#292a37]"} cursor-pointer`}>
                  <img
                    src={episode?.still_path ? "https://image.tmdb.org/t/p/w300" + episode.still_path : "/images/default.png"}
                    alt={episode?.name || "Episode"}
                    loading="lazy"
                    className="h-[4.3rem] w-28 shrink-0 rounded-md object-cover bg-zinc-900"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-orange-600 text-xs font-bold">
                      S{currentSeason} E{episode?.episode_number}
                    </p>
                    <h3 className="mt-2 text-white text-base font-bold leading-tight truncate">
                      {episode?.name}
                    </h3>
                    <p className="mt-2 text-sm leading-5 text-slate-500 line-clamp-2">
                      {episode?.overview || "No overview available."}
                    </p>
                  </div>
                  <button aria-label={`Play ${episode?.name}`} className="shrink-0 text-red-600 opacity-0 transition-opacity group-hover:opacity-100">
                    <MdPlayArrow size={28} />
                  </button>
                </div>
                )
                
                })}
            </div>
          ) : (
            <p className="text-slate-500">No episodes available for this season.</p>
          )}
        </div>
      </div>
      )}

      {recommended.length === 0 ? (
        <div style={{ display: "none" }}></div>
      ) : (
        <div>
          <CardRow data={recommended} heading={`You May Also Like `} />
        </div>
      )}
      {similar.length === 0 ? (
        <div style={{ display: "none" }}></div>
      ) : (
        <div>
          <CardRow data={similar} heading={`Similar`} media_type={explore} />
        </div>
      )}
      <div className="bg-zinc-950 h-1"></div>
    </>
  );
};

export default DetailPage;
