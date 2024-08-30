import Banner from "../components/Banner";
import { useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import CardRow from "../components/CardRow";

const Home = () => {
  const trendingData = useSelector((state) => state.FeelmData.bannerData);

  const { data: nowPlayingData } = useFetch("/movie/now_playing");
  const { data: topRatedData } = useFetch("/movie/top_rated");
  const { data: topRatedTv } = useFetch("/tv/top_rated");
  const { data: popularTv } = useFetch("/tv/popular");

  return (
    <div className=" tracking-[0.5px]">
      <Banner />
      <CardRow data={trendingData} heading={"Trending Now"} trending={true} />
      <CardRow
        data={nowPlayingData}
        heading={"Now Playing In Theaters"}
        media_type={"movie"}
      />
      <CardRow
        data={topRatedData}
        heading={"Top Rated Movies"}
        media_type={"movie"}
      />
      <CardRow
        data={topRatedTv}
        heading={"Top Rated Tv Shows"}
        media_type={"tv"}
      />
      <CardRow
        data={popularTv}
        heading={"Popular Tv Shows"}
        media_type={"tv"}
      />
    </div>
  );
};

export default Home;
