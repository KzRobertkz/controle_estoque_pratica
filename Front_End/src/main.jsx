import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom"
import Home from './pages/home.jsx'
import Estoque from './pages/estoque.jsx'
import Produtos from './pages/produtos.jsx' 



const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/Home",
    element: <Home />
  },
  {
    path: "/Estoque",
    element: <Estoque />
  },
  {
    path: "/Produtos",
    element: <Produtos />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
