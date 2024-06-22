import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import Home from './tsx/pages/Home.tsx'
import Error from './tsx/pages/Error.tsx'
import NavbarWrapper from './tsx/components/NavbarWrapper.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavbarWrapper />,
    errorElement: <Error />,
    children: [
      {
        path: '/', // yes, again
        element: <Home />,
        errorElement: <Error />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
