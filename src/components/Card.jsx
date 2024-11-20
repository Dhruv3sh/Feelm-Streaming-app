import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingImg from './LoadingImg';
import { RxCross2 } from "react-icons/rx";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../components/Firebase"; // Update this path based on your setup

const Card = ({ data, trending, Dots, index, media_type }) => {
    const imageURL = useSelector(state => state.FeelmData.imageURL);
    const [isLoaded, setIsLoaded] = useState(false);
    const { user } = useSelector((state)=> state.auth);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleImageError = () => {
        setIsLoaded(true); // Update to true to stop showing LoadingImg even on error
    };

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
                const updatedList = currentlyWatching.filter(item => item.id !== data.id);

                // Update the CurrentlyWatching list in Firestore
                await updateDoc(userRef, {
                    CurrentlyWatching: updatedList
                });

                console.log("Movie removed from Currently Watching");
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

    return (
        <div className=' box-border w-full min-w-[166px] max-w-[166px] min-h-[250px] max-h-[250px] overflow-hidden block rounded-lg relative hover:scale-[1.01] duration-200 max-md:w-[120px] max-md:h-[220px] max-sm:max-w-[130px] max-sm:min-w-[125px] max-sm:max-h-[190px] max-sm:min-h-[190px] '>
            {!isLoaded && <LoadingImg />}
            {data?.poster_path && (
                <Link to={`/${mediaType}/${data.id}`}>
                    <img
                        src={imageURL + data?.poster_path}
                        alt='poster'
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        className={`transition-all duration-700 ease-in-out ${isLoaded ? ' opacity-100' : ' opacity-0'}`}
                    />
                </Link>
            )}
            <div className='absolute top-3'>
                {trending && (
                    <div className='py-1 px-4 flex bg-black/50 backdrop-blur-3xl rounded-r-full overflow-hidden'>
                        #{index}<span className='hidden md:block pl-2'>Trending</span>
                    </div>
                )}
            </div>
            <div className='absolute top-3 right-0'>
                {Dots && (
                    <div className='flex flex-col py-1 px-1 overflow-hidden hover:backdrop-blur-2xl transition-all duration-200 hover:rounded-full'>
                        <button onClick={handleRemoveBtn} className='cursor-pointer'>
                            <RxCross2 size={26} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
