import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import $ from 'jquery'
import './App.css'
import App from './App.tsx'
import Login from './components/Login.jsx';
import ListChecklists from './components/ListChecklists.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <div><Login /></div>,
  },
  {
    path: "/",
    element: <div><ListChecklists /></div>,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
