import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import Login from './components/Login.jsx';
import ListChecklists from './components/ListChecklists.jsx';
import ErrorPage from './components/error/ErrorPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <div><Login /></div>,
    errorElement: <div><ErrorPage error="DefaultError" /></div>,
  },
  {
    path: "/",
    element: <div><ListChecklists /></div>,
    errorElement: <div><ErrorPage error="DefaultError" /></div>,
  },
  {
    path: "/error",
    element: <div><ErrorPage error="DefaultError" /></div>,
  },
  {
    path: "/admin",
    element: <div><Dashboard /></div>,
    errorElement: <div><ErrorPage error="DefaultError" /></div>,
  },
  {
    path: "/*",
    element: <div><ErrorPage error="NotFound" /></div>,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
