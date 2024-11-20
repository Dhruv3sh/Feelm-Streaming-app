import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import Card from '../components/Card';
import Loader from '../components/Loader'; 
import { useSelector } from 'react-redux';

function MyList() {
  const { user } = useSelector((state)=> state.auth);
  const { data: wishlistData } = useFetch("", true, user, "wishlist"); // Fetch data at top level
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
    <div className="bg-zinc-950 min-h-screen w-full pt-[70px]">
      <div className='container mx-auto'>
      <h3 className="capitalize text-lg lg:text-xl font-semibold my-3 max-sm:ml-2 max-lg:ml-9 lg:ml-5">
        My WishList
      </h3>
      {loading ? (
        // Show loader while fetching data
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader /> {/* Replace with your loader component */}
        </div>
      ) : delayedData?.length > 0 ? (
        // Show wishlist if data exists
        <div className="flex gap-1 md:gap-2 flex-wrap max-lg:justify-center lg:ml-5 -gap-y-1">
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
      <div className="bg-zinc-950 h-2"></div>
      </div>  
    </div>
  );
}

export default MyList;
