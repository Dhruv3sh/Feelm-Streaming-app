import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import LoadingImg from './LoadingImg';

const Card = ({ data, trending, index, media_type }) => {
    const imageURL = useSelector(state => state.FeelmData.imageURL);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleImageError = () => {
        setIsLoaded(true); // Update to true to stop showing LoadingImg even on error
    };

    const mediaType = data.media_type ?? media_type

    if (!data?.poster_path) {
        return null;
    }

    return (
        <Link to={'/' + mediaType + '/' + data.id} className='w-full min-w-[200px] max-w-[200px] h-[320px] overflow-hidden block rounded relative hover:scale-105 duration-200 max-[426px]:min-w-[180px] max-[426px]:max-w-[180px] max-[426px]:h-[270px] max-[376px]:max-w-[170px] max-[376px]:min-w-[170px]  '>
            {!isLoaded && <LoadingImg />}
            {data?.poster_path && (
                <img
                    src={imageURL + data?.poster_path}
                    alt='poster'
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className={`transition-all duration-700 ease-in-out ${isLoaded ? ' opacity-100' : ' opacity-0'}`}
                />
            )}
            <div className='absolute top-3'>
                {trending && (
                    <div className='py-1 px-4 bg-black/50 backdrop-blur-3xl rounded-r-full overflow-hidden'>
                        #{index} Trending
                    </div>
                )}
            </div>
            <div className='absolute bottom-0 h-9 backdrop-blur-3xl w-full bg-black/60 p-2'>
                <div className='text-sm text-neutral-400 flex justify-between items-center'>
                    <p className=' hidden sm:block'>{moment(data?.release_date).format('MMM Do YYYY')}</p>
                    <p className=' hidden max-[426px]:block'>{moment(data?.release_date).format('MMM YYYY')}</p>
                    <p className='bg-black px-1 rounded-full text-xs text-white'>Rating: {data && Number(data?.vote_average).toFixed(1)}</p>
                </div>
            </div>
        </Link>
    );
};

export default Card;
