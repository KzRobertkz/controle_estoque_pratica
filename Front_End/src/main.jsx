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
import { Produtos } from './pages/produtos.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import { Usuarios } from './pages/usuarios.jsx'
import { Historico } from './pages/historico.jsx'
import { Configuracoes } from './pages/configs.jsx'
import { SearchProvider } from './components/Header/searchcontent.jsx'

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
    element: <Signup />,
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
  {
    path: "/usuarios",
    element: <Usuarios />,
  },
  {
    path: "/historico",
    element: <Historico />,
  },
  {
    path: "/configuracoes",
    element: <Configuracoes />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
  </StrictMode>
)



