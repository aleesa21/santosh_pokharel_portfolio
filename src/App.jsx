import React from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Header from "./components/Header";
import AdminLayout from "./components/Adminlayout";
import Adminvideos from "./components/Adminvideos";
import Personaldetails from "./components/Personaldetails";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/header",
        element: <Header />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "videos",
        element: <Adminvideos />,
      },
      {
        path: "details",
        element: <Personaldetails />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
