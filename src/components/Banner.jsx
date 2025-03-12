import React, { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const Autoplay = (slider, { delay = 4000 } = {}) => {
    let timeout;
    let isMouseOver = false;
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    function nextTimeout() {
      clearTimeout(timeout);
      if (isMouseOver) return;
      timeout = setTimeout(() => {
        slider.next();
      }, delay);
    }
    slider.on("created", () => {
        // Start autoplay on creation
        nextTimeout();
      });
    slider.on('dragStarted', clearNextTimeout);
    slider.on('animationEnded', nextTimeout);
    slider.on('updated', nextTimeout);
  };

const Banner = ({ trendingMovie }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    easing: 'ease-out',
    dragStartThreshold: 1, // removes drag delay
  },
  [Autoplay]
  );

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  if (!trendingMovie || trendingMovie.length === 0) {
    return <Loading />;
  }

  return trendingMovie ? (
    <section ref={sliderRef}>
      <div
        className="flex min-h-full max-h-[98vh] overflow-hidden"
      >
        {trendingMovie.map((data, index) => {
          return (
            <div
              key={data.id || index}
              className="keen-slider__slide min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative"
            >
              <div className="w-full h-full">
                {data?.backdrop_path && (
                  <img
                    src={
                      "https://image.tmdb.org/t/p/w1280" + data?.backdrop_path
                    }
                    onLoad={handleImageLoad}
                    className={`h-full w-full object-cover ${
                      isLoaded ? " opacity-100" : " opacity-0"
                    } `}
                    alt="images"
                  />
                )}
              </div>

              <div className="absolute top-0 w-full h-full bg-gradient-to-t from-zinc-950 to-transparent"></div>
              <div>
                <div className=" w-full absolute bottom-0 max-w-md px-3">
                  <h2 className=" font-bold text-2xl md:text-4xl text-white drop-shadow-2xl ">
                    {data?.title || data?.name}
                  </h2>
                  <p className=" text-ellipsis line-clamp-3 max-md:line-clamp-2 my-2">
                    {data.overview}
                  </p>
                  <div className=" text-neutral-200 flex items-center gap-4">
                    <p>Rating: {Number(data.vote_average).toFixed(1)}+</p>
                    <span>|</span>
                    <p>View : {Number(data.popularity).toFixed(0)}</p>
                  </div>
                  <Link to={"/" + data.media_type + "/" + data.id}>
                    <button className=" bg-white px-4 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-orange-600 to-yellow-300 shadow-md active:scale-75 hover:scale-105 transition-all max-md:px-1 max-md:py-1 ">
                      Play Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  ) : (
    <Loading />
  );
};

export default memo(Banner);
