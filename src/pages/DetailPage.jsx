import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFetchDetail from "../hooks/useFetchDetail";
import moment from "moment/moment";
import CardRow from "../components/Cards/CardRow";
import Loading from "../components/Loaders/Loading";
import { Card, Skeleton } from "@heroui/react";
import { auth, db } from "../components/Firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { MdPlaylistAdd } from "react-icons/md";
import { MdPlaylistAddCheck } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import TrailerComponent from "../components/TrailerComponent";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { fetchRecommendations } from "../store/dataSlice";
import { useDispatch, useSelector } from "react-redux";

const DetailPage = () => {
  const Navigate = useNavigate();
  const {state} = useLocation();
  const { explore, id } = useParams();
  const dispatch = useDispatch();
  const { recommended,similar } = useSelector(
    (state) => state.MoviesAndShows
  );
  const { data } = useFetchDetail(
    `/${explore}/${id}`
  );
  const { data: castData } = useFetchDetail(
    `/${explore}/${id}/credits`
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCurrentWatchList, setInCurrentWatchList] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

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
      vote_count : state?.vote_count,
      overview : state?.overview,
      genres: data?.genres,
      duration: `${duration?.[0]}h ${duration?.[1]}m`
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
        duration: `${duration?.[0]}h ${duration?.[1]}m`
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
          Navigate(`/player/${explore}/${id}`);
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  return (
    <>
      <div className="w-full h-[360px] relative">
        <div className="h-full w-full relative">
          {!isLoaded && <Loading />}
          {state ? (
            <img
              src={
                "https://image.tmdb.org/t/p/w1280" + state?.backdrop_path ||
                state?.poster_path
              }
              onLoad={()=>setIsLoaded(true)}
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
              className=" bg-white w-[250px] px-1 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-orange-600 to-yellow-300 shadow-md active:scale-75 hover:scale-105 transition-all "
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
            <p>{data?.overview}</p>
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
                <b>Date :</b> {moment(state?.release_date).format("MMM Do YYYY")}
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
            {castData?.cast
              ?.filter((image) => image?.profile_path)
              .map((starCast, index) => {
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
                          onLoad={()=>setIsProfileLoaded(true)}
                          alt="Profile"
                          className={` mx-auto w-20 h-20 object-cover rounded-full transition-opacity duration-300  ${
                            isProfileLoaded ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      ) : (
                        //Skeleton loader if profile_path is not available
                        (<div>
                          <Skeleton className="rounded-full w-20 h-20" />
                        </div>)
                      )}
                    </div>
                    <p className=" font-thin text-sm text-center">
                      {starCast?.name}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {similar.length === 0 ? (
        <div style={{ display: "none" }}></div>
      ) : (
        <div>
          <CardRow
            data={similar}
            heading={`Similar`}
            media_type={explore}
          />
        </div>
      )}
      {recommended.length === 0 ? (
        <div style={{ display: "none" }}></div>
      ) : (
        <div>
          <CardRow data={recommended} heading={`Recommended `} />
        </div>
      )}
      <div className="bg-zinc-950 h-1"></div>
    </>
  );
};

export default DetailPage;
