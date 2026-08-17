import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "../App";
import Error from "../pages/Error";

const Home = lazy(() => import("../pages/Home"));
const ExplorePage = lazy(() => import("../pages/ExplorePage"));
const DetailPage = lazy(() => import("../pages/DetailPage"));
const Search = lazy(() => import("../pages/Search"));
const Player = lazy(() => import("../pages/Player"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const MyList = lazy(() => import("../pages/MyList"));


const lazyPage = (Component) => (
  <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error/>,
    children: [
      {
        path: "",
        element: lazyPage(Home)
      },
      {
        path: ":explore",
        element: lazyPage(ExplorePage)
      },
      {
        path: ":explore/:id",
        element: lazyPage(DetailPage)
      },
      {
        path: "search",
        element: lazyPage(Search)
      },
      {
        path: "myList",
        element: lazyPage(MyList)
      },
      {
        path: "userLogin",
        element: lazyPage(Login)
      },
      {
        path: "userSignup",
        element: lazyPage(Signup)
      },
      {
        path: "profile",
        element: lazyPage(ProfilePage)
      },
      {
        path: "/player/:explore/:id",
        element: lazyPage(Player)
      },
    ],
  },
]);

export default router;
