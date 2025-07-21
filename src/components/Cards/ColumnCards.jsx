import { Skeleton } from "@heroui/skeleton";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function ColumnCards({ data,mediaType }) {
    const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="m-1 grid grid-cols-[repeat(auto-fill,minmax(6rem,auto))] gap-1 sm:grid-cols-[repeat(auto-fill,minmax(7rem,auto))] md:grid-cols-[repeat(auto-fill,minmax(9rem,auto))] lg:grid-cols-[repeat(auto-fill,minmax(10rem,auto))] xl:grid-cols-[repeat(auto-fill,minmax(11rem,auto))] 3xl:grid-cols-[repeat(auto-fill,minmax(15rem,auto))] 4xl:grid-cols-[repeat(auto-fill,minmax(20rem,auto))]">
      {data?.map((Data, index) => {
        const imgPath = Data?.poster_path || Data?.backdrop_path;
        if (!imgPath) return null;
        return (
          <Link to={`/${mediaType || Data?.media_type}/${Data?.id}`} key={index} state={Data}>
            <Skeleton isLoaded={isLoaded}>
            <img
              src={`https://image.tmdb.org/t/p/w342${imgPath}`}
              alt="poster"
              onLoad={()=> setIsLoaded(true)}
              className={`hover:scale-[1.01] rounded-lg transition-all duration-200 ease-in-out"`}
            />
            </Skeleton>
            
          </Link>
        );
      })}
    </div>
  );
}

export default ColumnCards;
