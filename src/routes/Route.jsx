import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import ExplorePage from "../pages/ExplorePage";
import DetailPage from "../pages/DetailPage";
import Search from "../pages/Search";
import Player from "../pages/Player";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProfilePage from "../pages/ProfilePage";
import MyList from "../pages/MyList";
import Error from "../pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error/>,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: ":explore",
        element: <ExplorePage />,
      },
      {
        path: ":explore/:id",
        element: <DetailPage />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "myList",
        element: <MyList/>,
      },
      {
        path: "userLogin",
        element: <Login />,
      },
      {
        path: "userSignup",
        element: <Signup/>
      },
      {
        path: "profile",
        element: <ProfilePage/>
      },
      {
        path: "/player/:explore/:id",
        element: <Player />,
      },
    ],
  },
]);

export default router;
