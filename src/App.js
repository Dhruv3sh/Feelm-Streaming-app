import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNavigation from "./components/MobileNavigation";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBannerData, setImageURL } from "./store/FeelmSlice";

function App() {
  const dispatch = useDispatch();

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get("trending/all/week");

      dispatch(setBannerData(response.data.results));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchConfiguration = async () => {
    try {
      const response = await axios.get("/configuration");

      dispatch(setImageURL(response.data.images.secure_base_url + "original"));
    } catch (error) {}
  };

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();
  }, []);

  const location = useLocation();
  const hideFooter = location.pathname === "/UserLogin" || "/UserSignup";

  return (
    <main className="pb-14 lg:pb-0">
      <Header />
      <div>
        <Outlet />
        {!hideFooter && <Footer/>}
      </div>
      <MobileNavigation />
    </main>
  );
}

export default App;
