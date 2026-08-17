import { Skeleton } from "@heroui/skeleton";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function PosterCard({ item, mediaType }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgPath = item?.poster_path || item?.backdrop_path;

  if (!imgPath) return null;

  return (
    <Link
      to={`/${mediaType || item?.media_type}/${item?.id}`}
      state={item}
      className="block w-full aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900"
    >
      <Skeleton isLoaded={isLoaded} className="h-full w-full rounded-lg">
        <img
          src={`https://image.tmdb.org/t/p/w154${imgPath}`}
          alt={item?.title || item?.name || "poster"}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className="h-full w-full object-cover hover:scale-[1.01] transition-all duration-200 ease-in-out"
        />
      </Skeleton>
    </Link>
  );
}

function ColumnCards({ data,mediaType }) {

  return (
    <div className="m-1 grid grid-cols-[repeat(auto-fill,minmax(6rem,auto))] gap-1.5 sm:grid-cols-[repeat(auto-fill,minmax(7rem,auto))] md:grid-cols-[repeat(auto-fill,minmax(9rem,auto))] lg:grid-cols-[repeat(auto-fill,minmax(10rem,auto))] xl:grid-cols-[repeat(auto-fill,minmax(10rem,auto))] 3xl:grid-cols-[repeat(auto-fill,minmax(15rem,auto))] 4xl:grid-cols-[repeat(auto-fill,minmax(20rem,auto))]">
      {data?.map((item) => (
        <PosterCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
}

export default ColumnCards;
