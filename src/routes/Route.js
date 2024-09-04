import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import ExplorePage from "../pages/ExplorePage";
import DetailPage from "../pages/DetailPage";
import Search from "../pages/Search";
// import User from "../pages/User";
import Player from "../pages/Player";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
      // {
      //   path: "UserLogin",
      //   element: <User />,
      // },
      {
        path: "/player/:explore/:playerId",
        element: <Player />,
      },
    ],
  },
]);

export default router;
