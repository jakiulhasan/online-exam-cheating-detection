import React from "react";
import Home from "./pages/Homepage/page/Home";
import { RouterProvider } from "react-router/dom";
import Router from "./router/Router";
export const App = () => {
  return (
    <div class="max-w-7xl mx-auto">
      <RouterProvider router={Router} />
    </div>
  );
};
