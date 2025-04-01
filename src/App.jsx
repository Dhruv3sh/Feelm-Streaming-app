import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import MobileNavigation from "./components/MobileNavigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listenToAuthChanges } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);


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
