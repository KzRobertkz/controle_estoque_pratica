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
import Login from './pages/login.jsx'  // Página de login
import Signup from './pages/signup.jsx'  // Página de cadastro

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,  // Rota para a página de cadastro
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/estoque",
    element: <Estoque />,
  },
  {
    path: "/produtos",
    element: <Produtos />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)



