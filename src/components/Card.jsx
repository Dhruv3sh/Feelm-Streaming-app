import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoadingImg from "./LoadingImg";
import { RxCross2 } from "react-icons/rx";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../components/Firebase";

const Card = ({ data, trending, Dots, index, media_type }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const mediaType = data.media_type ?? media_type;

  const handleRemoveBtn = async (event) => {
    event.stopPropagation(); // Prevent event propagation
    if (!user) return; // Ensure user is logged in
    const userRef = doc(db, "users", user.uid);

    try {
      // Fetch the current CurrentlyWatching list
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const currentlyWatching = userData?.CurrentlyWatching || [];

        // Filter out the item to be removed
        const updatedList = currentlyWatching.filter(
          (item) => item.id !== data.id
        );
        // Update the CurrentlyWatching list in Firestore
        await updateDoc(userRef, {
          CurrentlyWatching: updatedList,
        });
      } else {
        console.error("User document does not exist");
      }
    } catch (error) {
      console.error("Error removing movie:", error);
    }
  };

  if (!data?.poster_path) {
    return null;
  }

  console.log(data)
  return (
    <>
      <div
        className={`min-w-[6rem] max-w-[6rem] sm:min-w-[7rem] md:min-w-[9rem] lg:min-w-[11rem] overflow-hidden rounded-lg relative transition-all ${
          isLoaded ? "block" : "none"
        }`}
      >
        {!isLoaded && (
          <div className=" absolute inset-0 duration-100 transition-all bg-default-300">
            <LoadingImg />
          </div>
        )}

          <Link to={`/${mediaType}/${data.id}`}>
            <img
              src={"https://image.tmdb.org/t/p/w342" + data?.poster_path}
              alt="poster"
              onLoad={() => setIsLoaded(true)}
              className={`hover:scale-[1.04] transition-all duration-200 ease-in-out ${
                isLoaded ? " opacity-100" : " opacity-0"
              }`}
            />
          </Link>
        <div className="absolute top-3">
          {trending && (
            <div className="py-1 px-4 flex bg-black/50 backdrop-blur-3xl rounded-r-full overflow-hidden">
              #{index}
              <span className="hidden md:block pl-2">Trending</span>
            </div>
          )}
        </div>
        <div className="absolute top-3 right-0">
          {Dots && (
            <div className="flex flex-col py-1 px-1 overflow-hidden hover:backdrop-blur-2xl transition-all duration-200 hover:rounded-full">
              <button onClick={handleRemoveBtn} className="cursor-pointer">
                <RxCross2 size={26} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
