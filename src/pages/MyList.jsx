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
    }, 600);

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [wishlistData]); // Re-run whenever wishlistData changes

  return (
    <div className="bg-zinc-950 min-h-screen w-full pt-[70px]">
      <div className='container mx-auto'>
      <h3 className="capitalize text-lg lg:text-xl font-semibold my-3 pl-5">
        My WishList
      </h3>
      {loading ? (
        // Show loader while fetching data
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader /> {/* Replace with your loader component */}
        </div>
      ) : delayedData?.length > 0 ? (
        // Show wishlist if data exists
        <div className="md:grid md:grid-cols-5 pl-2 md:pl-6 md:gap-y-5 lg:grid-cols-4 xl:grid-cols-5 flex gap-[2px] flex-wrap">
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
      <div className="bg-zinc-950 h-1"></div>
      </div>  
    </div>
  );
}

export default MyList;
