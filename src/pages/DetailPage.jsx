import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDetail from "../hooks/useFetchDetail";
import moment from "moment/moment";
import useFetch from "../hooks/useFetch";
import CardRow from "../components/CardRow";
import Loading from "../components/Loading";
import { Card, Skeleton } from "@nextui-org/react";
import { auth, db } from "../components/Firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc
} from "firebase/firestore";
import { toast } from "react-toastify";
import { MdPlaylistAdd } from "react-icons/md";
import { MdPlaylistAddCheck } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

const DetailPage = () => {
  const Navigate = useNavigate();
  const params = useParams();
  const { data } = useFetchDetail(`/${params?.explore}/${params?.id}`);
  const { data: similarData } = useFetch(
    `/${params?.explore}/${params?.id}/similar`
  );
  const { data: recommendedData } = useFetch(
    `/${params?.explore}/${params?.id}/recommendations`
  );
  const { data: castData } = useFetchDetail(
    `/${params?.explore}/${params?.id}/credits`
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCurrentWatchList, setInCurrentWatchList] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleProfileLoaded = () => {
    setIsProfileLoaded(true);
  };

  const duration = (data?.runtime / 60).toFixed(1).split(".");

  useEffect(() => {
    const fetchUserLists = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData) {
          setInWishlist(userData.wishlist?.some((item) => item.id === data.id));
          setInCurrentWatchList(
            userData.CurrentlyWatching?.some((item) => item.id === data.id)
          );
        }
      }
    };

    fetchUserLists();
  }, [data?.id]);

  // Add to Wishlist
  const handleAddToWishlist = async () => {
    if (!auth.currentUser) {
      toast.warning("Please log in to add to your wishlist.");
      return;
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    const item = {
      id: data.id,
      title: data.title || data.name,
      poster_path: `${data.poster_path}`,
      media_type: params.explore,
      release_date: data.release_date || data.first_air_date,
      vote_average: data.vote_average,
    };

    try {
      await updateDoc(userRef, {
        wishlist: arrayUnion(item),
      });
      setInWishlist(true);
      toast.success("Added to Wishlist!", {
        position: "top-center",
        theme: "dark",
        autoClose: 1200,
      });
    } catch (error) {
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
    event.stopPropagation(); // Prevent event propagation
    if (!auth.currentUser) {
      toast.warning("Please log in to access your wishlist.");
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
        const updatedList = wishlist.filter(
          (item) => item.id !== data.id
        );

        // Update the wishlist list in Firestore
        await updateDoc(userRef, {
          wishlist: updatedList,
        });
        setInWishlist(false);
        toast.success("Removed from Wishlist!", {
        position: "top-center",
        theme: "dark",
        autoClose: 1200,
      });
      } else {
        toast.error("item does not exist in db", {
          position: "top-center",
          theme: "dark",
          autoClose: 1200,
        });
      }
    } catch (error) {
      toast.error("Failed to remove from Wishlist.", {
            position: "top-center",
            theme: "dark",
            autoClose: 1200,
          });
    }
  };

  const handlePlayBtn = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const item = {
        id: data.id,
        title: data.title || data.name,
        poster_path: `${data.poster_path}`,
        media_type: params.explore,
        release_date: data.release_date || data.first_air_date,
        vote_average: data.vote_average,
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
            console.log("Added to Currently Watching");
          } else {
            console.log("Already in Currently Watching list");
          }

          // Navigate to the player regardless of the list status
          Navigate(`/player/${params?.explore}/${data?.id}`);
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error updating Currently Watching:", error);
      }
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [params.id]);

  return (
    <div>
      <div className="w-full h-[360px] relative">
        <div className="h-full w-full">
          {!isLoaded && <Loading />}
          {data ? (
            <img
              src={'https://image.tmdb.org/t/p/w1280' + data?.backdrop_path || data?.poster_path}
              onLoad={handleImageLoad}
              alt="banner"
              className={`h-full w-full object-cover transition-all duration-400 ease-in-out ${
                isLoaded ? " opacity-100" : " opacity-0"
              }`}
            />
          ) : (
            <Loading />
          )}
        </div>

        <div className=" absolute w-full h-full top-0 bg-gradient-to-t from-zinc-950/100 to-transparent"></div>
      </div>
      <div className=" px-4 py-1 md:py-0 flex flex-col md:flex-row gap-5 lg:gap-8">
        <div className=" relative mx-auto md:mx-0 md:-mt-24 lg:-mt-36 w-64 min-w-60 max-lg:min-w-52 hidden md:block">
          {data?.poster_path ? (
            <img
              src={'https://image.tmdb.org/t/p/w1280' + data?.poster_path}
              alt="banner"
              className=" mih-h-80 object-cover rounded-md"
            />
          ) : (
            <Card className="w-[240px] " radius="sm">
              <Skeleton className="rounded-sm">
                <div className=" h-[360px] rounded-lg bg-default-300"></div>
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
          <h2 className=" text-2xl md:text-3xl lg:text-4xl font-bold text-white pt-2 pb-2">
            {data?.title || data?.name}
          </h2>
          <p className=" capitalize text-neutral-400 ">{data?.tagline}</p>
          <div className="flex items-center my-3 gap-2 font-thin max-[320px]:text-center">
            <p>
              <b>Rating :</b> {Number(data?.vote_average).toFixed(1)}
            </p>

            <span>|</span>
            <p>
              <b>Views : </b>
              {Number(data?.vote_count)}
            </p>
            <span>|</span>
            <p>
              <b>Duration : </b>
              {duration[0]}h {duration[1]}m
            </p>
          </div>
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
              <span>|</span>
              <p>{data?.genres?.[1]?.name}</p>
            </div>
            <p className=" border-b-1 border-neutral-800 my-2 "></p>

            <div className=" flex flex-row max-[370px]:flex-col gap-1 font-thin py-1 max-[320px]:gap-1">
              <p>
                <b>Status : </b>
                {data?.status}
              </p>
              <span className="max-[370px]:hidden">|</span>
              <p>
                <b>Date :</b> {moment(data?.release_date).format("MMM Do YYYY")}
              </p>
            </div>
          </div>
          <div>
            <p className=" border-b-1 border-neutral-800 my-2 "></p>
            <p>
              <span>Director</span> :{" "}
              {castData?.crew?.find((member) => member.job === "Director")
                ?.name ||
                castData?.crew?.find((member) => member.job === "Producer")
                  ?.name}
            </p>
            <p className=" border-b-1 border-neutral-800 my-2 "></p>
          </div>
          <h2 className=" font-bold text-lg">Cast : </h2>
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
                          src={'https://image.tmdb.org/t/p/w300' + starCast.profile_path}
                          onLoad={handleProfileLoaded}
                          alt="Profile"
                          className={`w-20 h-20 object-cover rounded-full transition-opacity duration-300  ${
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
                    <p className=" font-thin text-sm text-center lg:pr-6">
                      {starCast?.name}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {similarData.length === 0 ? (
        <div style={{ display: "none" }}></div>
      ) : (
        <div>
          <CardRow
            data={similarData}
            heading={`Similar`}
            media_type={params?.explore}
          />
        </div>
      )}
      {recommendedData.length === 0 ? (
        <div style={{ display: "none" }}></div>
      ) : (
        <div>
          <CardRow data={recommendedData} heading={`Recommended `} />
        </div>
      )}
      <div className="bg-zinc-950 h-1"></div>
    </div>
  );
};

export default DetailPage;
