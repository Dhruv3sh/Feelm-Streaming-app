import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Loading from './Loading';

const Banner = () => {
    const bannerData = useSelector(state => state.FeelmData.bannerData)
    const imageURL = useSelector(state => state.FeelmData.imageURL)
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const [currentImage, setCurrentImage] = useState(0)

    const handleNext = () => {
        setCurrentImage((prevImage) => (prevImage < bannerData.length - 1 ? prevImage + 1 : 0));

    }

    const handlePrevious = () => {
        setCurrentImage((prevImage) => (prevImage > 0 ? prevImage - 1 : bannerData.length - 1));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage < bannerData.length - 1 ? prevImage + 1 : setCurrentImage(0)));

        }, 3500)

        return () => clearInterval(interval)
    }, [bannerData])

    if (!bannerData || bannerData.length === 0) {
        return <Loading />;
    }

    return (imageURL ?
        <section className='w-full h-full'>
            <div className='flex min-h-full max-h-[95vh] overflow-hidden'>
                {
                    bannerData.map((data, index) => {
                        return (
                            <div key={data.id || index} className=' min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all duration-700 ' style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                <div className='w-full h-full'>
                                    {!isLoaded && <Loading />}
                                    {data?.backdrop_path && <img
                                        src={imageURL + data?.backdrop_path}
                                        onLoad={handleImageLoad}
                                        className={`h-full w-full object-cover transition-all duration-700 ease-in-out ${isLoaded ? ' opacity-100' : ' opacity-0'} `}
                                        alt='images'
                                    />}

                                </div>

                                <div className='absolute top-0 w-full h-full text-black hidden items-center justify-between group-hover:lg:flex '>
                                    <button onClick={handlePrevious} className=' pl-4 hover:scale-110 active:scale-75 z-10'>
                                        <FaAngleLeft size={24} />
                                    </button>
                                    <button onClick={handleNext} className=' pr-4 hover:scale-110 active:scale-75 z-10'>
                                        <FaAngleRight size={24} />
                                    </button>
                                </div>


                                <div className='absolute top-0 w-full h-full bg-gradient-to-t from-zinc-950 to-transparent'>
                                </div>
                                <div className='container mx-auto'>
                                    <div className=' w-full absolute bottom-0 max-w-md px-3'>
                                        <h2 className=' font-bold text-2xl md:text-4xl text-white drop-shadow-2xl '>{data?.title || data?.name}</h2>
                                        <p className=' text-ellipsis line-clamp-3 max-md:line-clamp-2 my-2'>{data.overview}</p>
                                        <div className=' text-neutral-200 flex items-center gap-4'>
                                            <p>Rating: {Number(data.vote_average).toFixed(1)}+</p>
                                            <span>|</span>
                                            <p>View : {Number(data.popularity).toFixed(0)}</p>
                                        </div>
                                        <Link to={'/' + data.media_type + '/' + data.id}>
                                            <button className=' bg-white px-4 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-orange-600 to-yellow-300 shadow-md active:scale-75 hover:scale-105 transition-all max-md:px-1 max-md:py-1 '>Play Now</button>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

        </section>
        : <Loading />)
}

export default Banner