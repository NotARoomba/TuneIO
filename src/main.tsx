import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import Home from "./tsx/pages/Home.tsx";
import Error from "./tsx/pages/Error.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PageWrapper from "./tsx/components/misc/PageWrapper.tsx";
import Play from "./tsx/pages/Play.tsx";
import Settings from "./tsx/pages/Settings.tsx";
import Profile from "./tsx/pages/Profile.tsx";
import Login from "./tsx/pages/Login.tsx";
import Signup from "./tsx/pages/Signup.tsx";
import Daily from "./tsx/pages/listening/Daily.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageWrapper />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: "/play",
        element: <Play />,
        errorElement: <Error />,
      },
      {
        path: "/settings",
        element: <Settings />,
        errorElement: <Error />,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <Error />,
      },
      {
        path: "/signup",
        element: <Signup />,
        errorElement: <Error />,
      },
      {
        path: "/profile",
        element: <Profile />,
        errorElement: <Error />,
      },
      {
        path: "/play/daily",
        element: <Daily />,
        errorElement: <Error />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
