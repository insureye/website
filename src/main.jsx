import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider
  } from 'react-router-dom';
import { Home, App, Dashboard } from './components';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet-geosearch/dist/geosearch.css';
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: 'app', element: <App />},
  { path: 'dashboard', element: <Dashboard/>}
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
