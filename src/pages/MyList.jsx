import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import ColumnCards from "../components/Cards/ColumnCards";

function MyList() {
  const { user } = useSelector((state) => state.auth);
  const { data: wishlistData } = useFetch(true, user, "wishlist"); // Fetch data at top level
  const [loading, setLoading] = useState(true); // State for loading status
  const [delayedData, setDelayedData] = useState(null); // State for delayed data

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setDelayedData(wishlistData);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [wishlistData]);

  return (
    <div className=" min-h-screen w-full pt-[70px] 3xl:pt-40">
      <div>
        <h3 className="capitalize text-lg lg:text-xl font-semibold mx-1 my-2 md:mx-2 md:my-3 3xl:mt-10">
          My WishList
        </h3>
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="flex justify-center items-center pt-3">
              <div className="animate-spinner-linear-spin rounded-full h-10 w-10 border-t-3 border-blue-500 border-solid"></div>
            </div>
          </div>
        ) : delayedData?.length > 0 ? (
          <ColumnCards data={delayedData}/>
        ) : (
          <h1 className="text-center text-2xl md:text-4xl">
            Your List is Empty..
          </h1>
        )}
        <div className="bg-zinc-950 h-2"></div>
      </div>
    </div>
  );
}

export default MyList;
