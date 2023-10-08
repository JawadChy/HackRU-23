import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

import App from './App.jsx'
import ResultsPage from './routes/Results.jsx';

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/results", element: <ResultsPage /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
