import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchDetail from "../hooks/useFetchDetail";
import { PiDotOutlineFill } from "react-icons/pi";
import moment from "moment";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import useFetch from "../hooks/useFetch";
import CardRow from "../components/CardRow";

const Player = () => {
  const { playerId, explore, params } = useParams();
  const { data } = useFetchDetail(`/${explore}/${playerId}`);
  const { data: castData } = useFetchDetail(`/${explore}/${playerId}/credits`);
  const movieurl = `https://vidsrc.xyz/embed/${explore}/${playerId}`;
  const { data: similarData } = useFetch(`/${explore}/${playerId}/similar`);
  const { data: recommendedData } = useFetch(
    `/${explore}/${playerId}/recommendations`
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const preventRedirection = (event) => {
      if (event.target.tagName === "IFRAME") {
        event.preventDefault();
      }
    };

    document.addEventListener("click", preventRedirection);

    return () => {
      document.removeEventListener("click", preventRedirection);
    };
  }, []);

  return (
    <div className=" w-full pt-16">
      <div className="flex flex-col w-full">
        <div className="w-full h-full">
          <iframe
            className="w-full h-[480px] max-lg:h-[350px] max-sm:h-[280px] mx-auto"
            src={movieurl}
            title="Video player"
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className=" container w-full py-3 px-2">
          <div className="flex max-md:flex-col gap-2">
            <h2 className="font-bold text-3xl text-white">
              {data?.title || data?.name}
            </h2>
            <p className="hidden lg:block capitalize text-neutral-400 text-2xl pt-[2px]">
              ({data?.tagline})
            </p>
          </div>

          <div className="flex items-center gap-1 pt-1 font-thin max-[320px]:text-center">
            <p>Rating : {Number(data?.vote_average).toFixed(1)}</p>
            <PiDotOutlineFill />
            <p>{data?.genres?.[0]?.name}</p>
            {data?.genres?.[1] && (
              <>
                <span>|</span>
                <p>{data?.genres?.[1]?.name}</p>
              </>
            )}
            <p className=" hidden md:block">
              <PiDotOutlineFill />
            </p>

            <p className=" hidden md:block">
              {moment(data?.release_date).format("MMM Do YYYY")}
            </p>
          </div>

          <div className=" flex flex-row relative">
            <div
              className={`pt-5 text-12px leading-tight sm:text-13px 2xl:text-sm text-white transition-all duration-700 ${
                isExpanded ? "line-clamp-none" : "line-clamp-1"
              }`}
            >
              <p className=" pr-3">{data?.overview}</p>
              <p className="pt-4 text-12px sm:text-13px 2xl:text-sm text-white opacity-50 gap-1">
                Cast :{" "}
                {castData?.cast
                  ?.filter((acting) => acting.known_for_department === "Acting")
                  ?.map((actor, index, array) => (
                    <span key={actor.id}>
                      {actor.name}
                      {index < array.length - 1 && ", "}
                    </span>
                  ))}
              </p>
            </div>
            <div>
              <button
                className="text-white absolute top-3 -right-2"
                onClick={toggleExpand}
              >
                {isExpanded ? (
                  <RiArrowDropUpLine size={30} />
                ) : (
                  <RiArrowDropDownLine size={30} />
                )}
              </button>
            </div>
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

export default Player;
