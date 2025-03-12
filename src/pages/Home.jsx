import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../components/Banner";
import useFetch from "../hooks/useFetch";
import CardRow from "../components/CardRow";
import { toast } from "react-toastify";
import { fetchMoviesAndShows } from "../store/dataSlice";

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    trending,
    nowPlaying,
    topRatedMovies,
    topRatedTv,
    popularTv
  } = useSelector((state) => state.MoviesAndShows);
  const { data: wishlistData } = useFetch(true, user, "wishlist");
  const { data: CurrentlyWatchingData } = useFetch(
    true,
    user,
    "CurrentlyWatching"
  );

  useEffect(() => {
    if (!trending.length) {
      dispatch(fetchMoviesAndShows());
    }
  }, [dispatch, trending.length]);

  useEffect(() => {
    const redirectedFromSignup =
      localStorage.getItem("redirectedFromSignup") === "true";
    const redirectedFromLogin =
      localStorage.getItem("redirectedFromLogin") === "true";

    if (redirectedFromSignup) {
      // Show toast message
      toast.success("Registered Successfully!", {
        position: "top-center",
        autoClose: 1200,
        theme: "dark",
      });
      localStorage.removeItem("redirectedFromSignup");
    } else if (redirectedFromLogin) {
      toast.success("Loged in Successfully!", {
        position: "top-center",
        autoClose: 1200,
        theme: "dark",
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
        autoClose: 1200,
        theme: "dark",
      });
      localStorage.removeItem("redirectedFromProfile");
    }
  }, []);

  return (
    <div className="tracking-[0.5px] ">
      <Banner trendingMovie={trending} />
      {user && CurrentlyWatchingData.length > 0 && (
        <CardRow
          data={CurrentlyWatchingData}
          heading={"Continue Watching"}
          media_type={"movie"}
          Dots={true}
        />
      )}
      {user && wishlistData && wishlistData.length > 0 && (
        <CardRow
          data={wishlistData}
          heading={"Your Wishlist"}
          media_type={"movie"}
        />
      )}
      <CardRow data={trending} heading={"Trending Now"} trending={true} />
      <CardRow
        data={nowPlaying}
        heading={"Now Playing In Theaters"}
        media_type={"movie"}
      />
      <CardRow
        data={topRatedMovies}
        heading={"Top Rated Movies"}
        media_type={"movie"}
      />
      <CardRow
        data={topRatedTv}
        heading={"Top Rated TV Shows"}
        media_type={"tv"}
      />
      <CardRow
        data={popularTv}
        heading={"Popular TV Shows"}
        media_type={"tv"}
      />
      <div className="bg-zinc-950 h-1"></div>
    </div>
  );
}
