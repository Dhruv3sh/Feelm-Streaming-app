import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Banner from "../components/Banner";
import useFetch from "../hooks/useFetch";
import CardRow from "../components/CardRow";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useAuth();
  const trendingData = useSelector((state) => state.FeelmData.bannerData);
  const { data: nowPlayingData } = useFetch("/movie/now_playing");
  const { data: topRatedData } = useFetch("/movie/top_rated");
  const { data: topRatedTv } = useFetch("/tv/top_rated");
  const { data: popularTv } = useFetch("/tv/popular");
  const { data: wishlistData } = useFetch("", true, user, "wishlist");
  const { data: CurrentlyWatchingData } = useFetch(
    "",
    true,
    user,
    "CurrentlyWatching"
  );
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    const redirectedFromSignup =
      localStorage.getItem("redirectedFromSignup") === "true";
    const redirectedFromLogin =
      localStorage.getItem("redirectedFromLogin") === "true";

    if (redirectedFromSignup) {
      // Show toast message
      toast.success("Registered Successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
        hideProgressBar: true,
      });
      localStorage.removeItem("redirectedFromSignup");
    } else if (redirectedFromLogin) {
      toast.success("Loged in Successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
        hideProgressBar: true,
      });
      localStorage.removeItem("redirectedFromLogin");
    }
  }, [user]);

  useEffect(() => {
    const redirectedFromProfile =
      localStorage.getItem("redirectedFromProfile") === "true";
    if (redirectedFromProfile) {
      toast.success("Loged out Successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
        hideProgressBar: true,
      });
      localStorage.removeItem("redirectedFromProfile");
    }
  }, []);

  // Set a timeout to show content after some time (simulating loading)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 100); // Delay the loading for other components (can be adjusted)
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="tracking-[0.5px] ">
      <Banner />
      {/* Render the rest of the content after a delay */}
      {isContentLoaded && (
        <>
          <CardRow
            data={trendingData}
            heading={"Trending Now"}
            trending={true}
          />

          <CardRow
            data={nowPlayingData}
            heading={"Now Playing In Theaters"}
            media_type={"movie"}
          />
          {user && CurrentlyWatchingData.length > 0 && (
            <CardRow
              data={CurrentlyWatchingData}
              heading={"Continue Watching"}
              media_type={"movie"}
              Dots={true}
            />
          )}
          <CardRow
            data={topRatedData}
            heading={"Top Rated Movies"}
            media_type={"movie"}
          />
          <CardRow
            data={topRatedTv}
            heading={"Top Rated TV Shows"}
            media_type={"tv"}
          />
          {user && wishlistData && wishlistData.length > 0 && (
            <CardRow
              data={wishlistData}
              heading={"Your Wishlist"}
              media_type={"movie"}
            />
          )}
          <CardRow
            data={popularTv}
            heading={"Popular TV Shows"}
            media_type={"tv"}
          />
        </>
      )}
      <div className="bg-zinc-950 h-1"></div>
    </div>
  );
}
