import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './router.css'

import Homepage from './routes/Homepage.jsx'

import Resultspage from './routes/Results.jsx';

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/results", element: <Resultspage /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
