import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import Card from '../components/Card';
import Loader from '../components/Loader'; // Assume you have a Loader component

function MyList() {
  const { user } = useAuth();
  const { data: wishlistData } = useFetch("", true, user, "wishlist"); // Fetch data at top level
  const [loading, setLoading] = useState(true); // State for loading status
  const [delayedData, setDelayedData] = useState(null); // State for delayed data

  // Handle simulated delay
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setDelayedData(wishlistData); 
      setLoading(false);
    }, 550);

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [wishlistData]); // Re-run whenever wishlistData changes

  return (
    <div className="bg-zinc-950 min-h-screen w-full pt-[70px]">
      <h3 className="capitalize text-lg lg:text-xl font-semibold my-3 pl-3">
        My WishList
      </h3>
      {loading ? (
        // Show loader while fetching data
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader /> {/* Replace with your loader component */}
        </div>
      ) : delayedData?.length > 0 ? (
        // Show wishlist if data exists
        <div className="grid grid-cols-5 pl-3 gap-y-4 lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-3 max-sm:grid-cols-2">
          {delayedData.map((elem, index) => (
            <Card
              data={elem}
              key={elem.id + index}
              heading={"Your Wishlist"}
              media_type={"movie"}
            />
          ))}
        </div>
      ) : (
        // Show empty list message if no data
        <h1 className="text-center text-2xl md:text-4xl">
          Your List is Empty..
        </h1>
      )}
    </div>
  );
}

export default MyList;
