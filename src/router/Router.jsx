import React from "react";
import { createBrowserRouter } from "react-router";
import Home from "../pages/Homepage/page/Home";
import MainLayout from "../Layouts/MainLayout";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [{ path: "/", Component: Home }],
  },
]);

export default Router;
