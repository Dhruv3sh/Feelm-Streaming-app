import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDetail from "../hooks/useFetchDetail";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import useFetch from "../hooks/useFetch";
import CardRow from "../components/CardRow";
import Loading from "../components/Loading";
import { Card, Skeleton } from "@nextui-org/react";

const DetailPage = () => {
  const Navigate = useNavigate();
  const params = useParams();
  const imageURL = useSelector((state) => state.FeelmData.imageURL);
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

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleProfileLoaded = () => {
    setIsProfileLoaded(true);
  };

  const duration = (data?.runtime / 60).toFixed(1).split(".");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [params]);

  return (
    <div>
      <div className="w-full h-[350px] relative">
        <div className="h-full w-full">
          {!isLoaded && <Loading />}
          {imageURL ? (
            <img
              src={imageURL + data?.backdrop_path || data?.poster_path}
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
      <div className=" container mx-auto px-4 py-16 md:py-0 flex flex-col md:flex-row gap-5 lg:gap-10">
        <div className=" relative mx-auto md:mx-0 md:-mt-24  lg:-mt-36 w-fit min-w-60 hidden md:block">
          {data?.poster_path ? (
            <img
              src={imageURL + data?.poster_path}
              alt="banner"
              className=" h-80 w-52 lg:h-[360px] lg:w-[450px] lg:max-w-[250px] md:h-[280px] md:w-[600px] max object-cover rounded-md"
            />
          ) : (
            <Card className="w-[240px] " radius="sm">
              <Skeleton className="rounded-sm">
                <div className=" h-[360px] rounded-lg bg-default-300"></div>
              </Skeleton>
            </Card>
          )}

          <button
            className=" bg-white w-[250px] px-1 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-orange-600 to-yellow-300 shadow-md active:scale-75 hover:scale-105 transition-all "
            onClick={() => {
              Navigate(`/player/${params?.explore}/${data?.id}`);
            }}
          >
            Play now
          </button>
        </div>

        <div>
          <button
            className=" hidden bg-white w-40 px-4 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-orange-600 to-yellow-300 shadow-md active:scale-75 hover:scale-105 transition-all max-md:px-1 max-md:py-1 max-md:block "
            onClick={() => {
              Navigate(`/player/${params?.explore}/${data?.id}`);
            }}
          >
            Play now
          </button>
          <h2 className=" text-2xl md:text-3xl lg:text-4xl font-bold text-white pb-2">
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
                  <div key={imageURL + index}>
                    <div>
                      {/* Skeleton loader while the image is loading */}
                      {!isProfileLoaded && (
                        <div>
                          <Skeleton className="rounded-full w-20 h-20" />
                        </div>
                      )}

                      {/* Image rendering if profile_path is available */}
                      {imageURL || starCast?.profile_path ? (
                        <img
                          src={imageURL + starCast.profile_path}
                          onLoad={handleProfileLoaded}
                          alt="Profile"
                          className={`w-20 h-20 object-cover rounded-full transition-opacity duration-300  ${
                            isProfileLoaded ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      ) : (
                        // Fallback Skeleton loader if profile_path is not available
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
    </div>
  );
};

export default DetailPage;