import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Route";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "./store/Store";
import { HeroUIProvider } from "@heroui/react";


/*axios Setup*/
axios.defaults.baseURL = "https://api.themoviedb.org/3";
axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HeroUIProvider>
    <main className="dark text-foreground bg-zinc-950">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </main>
  </HeroUIProvider>
);
