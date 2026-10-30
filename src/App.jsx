import React from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { RouterProvider } from "react-router/dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Header from "./components/Header";
import AdminLayout from "./components/Adminlayout";
import Adminvideos from "./components/Adminvideos";
import Personaldetails from "./components/Personaldetails";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

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
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="videos" replace />,
      },
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
  {
    path: "/login",
    element: <Login />,
  },
]);
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
