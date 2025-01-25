import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import MobileNavigation from "./components/MobileNavigation";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBannerData } from "./store/FeelmSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listenToAuthChanges } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get("trending/all/week");
      dispatch(setBannerData(response.data.results));
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    fetchTrendingData();
  }, []);


  return (
    <main className="pb-14 lg:pb-0">
      <Header />
      <div>
        <ToastContainer/>
        <Outlet />
      </div>
      <MobileNavigation />   
    </main>
  );
}

export default App;
