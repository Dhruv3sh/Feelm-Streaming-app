import { Skeleton } from "@nextui-org/react";
import React from "react";

const LoadingImg = () => {
  return (
    <Skeleton className="  box-border min-w-[145px] max-w-[180px] min-h-[210px] overflow-hidden block rounded-lg relative hover:scale-[1.01] duration-200 max-md:min-w-[140px] max-md:min-h-[220px] max-sm:max-w-[130px] max-sm:min-w-[90px] max-sm:min-h-[150px] max-sm:max-h-[160px] bg-default-300"></Skeleton>
  );
};

export default LoadingImg;
