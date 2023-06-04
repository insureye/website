import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider
  } from 'react-router-dom';
import { Home, Map } from './components';
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: 'app', element: <Map />}
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
