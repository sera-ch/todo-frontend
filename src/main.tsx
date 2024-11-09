import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import $ from 'jquery'
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
    title: "Login",
  },
  {
    path: "/",
    element: <div><ListChecklists /></div>,
    title: "Home"
  },
  {
    path: "/error",
    title: "Error",
  },
  {
    path: "/admin",
    element: <div><Dashboard /></div>,
    title: "Dashboard",
  },
  {
    path: "/*",
    element: <div><ErrorPage error="NotFound" /></div>,
    title: "Not Found",
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
