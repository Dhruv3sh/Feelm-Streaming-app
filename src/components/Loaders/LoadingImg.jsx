import { Skeleton } from "@heroui/react";
import React from "react";

const LoadingImg = () => {
  return (
    <Skeleton className="rounded-sm">
      <div className=" min-h-[9rem] sm:min-h-[13.5rem] md:min-h-[17rem] lg:min-h-[1rem]rounded-lg bg-default-300"></div>
    </Skeleton>
  );
};

export default LoadingImg;
