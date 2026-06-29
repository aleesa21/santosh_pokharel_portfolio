import React from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from './components/Layout';
import Home from './pages/Home';
import Header from './components/Header';

const router = createBrowserRouter([
  {
    element:<Layout />,
    children:[
      {
        path:"/header",
        element:<Header />
      },
      {
        path:"/",
        element:<Home />
      }
    ]
  },
]);
function App() {
  return (
    <RouterProvider router={router} >

    </RouterProvider>
    
  )
}

export default App