import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../components/Banner";
import useFetch from "../hooks/useFetch";
import CardRow from "../components/Cards/CardRow";
import { toast } from "react-toastify";
import { fetchMoviesAndShows } from "../store/dataSlice";
import Loading from "../components/Loaders/Loading";
import SkeletonCardRow from "../components/Loaders/SkeletonCardRow";
import { Helmet } from "react-helmet";

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    trending,
    nowPlaying,
    topRatedMovies,
    topRatedTv,
    popularTv,
    loading
  } = useSelector((state) => state.MoviesAndShows);
  const { data: wishlistData } = useFetch(true, user, "wishlist");
  const { data: CurrentlyWatchingData } = useFetch(
    true,
    user,
    "CurrentlyWatching"
  );

  useEffect(() => {
    if (trending.length === 0) {
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

      {/** ✅ SEO Helmet **/}
      <Helmet>
        <title>FeelmMovies | Stream Trending Movies & Shows</title>
        <meta
          name="description"
          content="Watch trending movies, top-rated shows, and the latest releases on FeelmMovies. Enjoy your personalized wishlist and continue watching anytime."
        />
        <meta name="keywords" content="movies, tv shows, watch online, streaming, trending, top rated, feelm, feelmmovies" />
        <meta property="og:title" content="Feelmmovies – Stream Trending Movies & Shows" />
        <meta property="og:description" content="Watch trending movies, top-rated shows, and more on Feelmmovies – your personalized streaming experience." />
        <meta property="og:url" content="https://feelmmovies.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://feelmmovies.vercel.app/images/logo.png" />
        <link rel="canonical" href="https://feelmmovies.vercel.app/" />
      </Helmet>
      
      {loading ? <Loading /> : <Banner trendingMovie={trending} />}
      {user && CurrentlyWatchingData?.length > 0 && (
        <CardRow
          data={CurrentlyWatchingData}
          heading={"Continue Watching"}
          media_type={"movie"}
          Dots={true}
        />
      )}
      {user && wishlistData?.length > 0 && (
        <CardRow
          data={wishlistData}
          heading={"Your Wishlist"}
          media_type={"movie"}
        />
      )}
      {loading ? <SkeletonCardRow /> : <CardRow data={trending} heading={"Trending Now"} trending={true} />}
      {loading ? <SkeletonCardRow /> : <CardRow
        data={nowPlaying}
        heading={"Now Playing In Theaters"}
        media_type={"movie"}
      />}
      {loading ? <SkeletonCardRow /> : <CardRow
        data={topRatedMovies}
        heading={"Top Rated Movies"}
        media_type={"movie"}
      />}
      {loading ? <SkeletonCardRow /> : <CardRow
        data={topRatedTv}
        heading={"Top Rated TV Shows"}
        media_type={"tv"}
      />}
      {loading ? <SkeletonCardRow /> : <CardRow
        data={popularTv}
        heading={"Popular TV Shows"}
        media_type={"tv"}
      />}

      <div className="bg-zinc-950 h-1"></div>
    </div>
  );
}
