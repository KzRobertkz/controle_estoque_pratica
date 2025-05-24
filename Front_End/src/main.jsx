import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom"
import LandingPage from './pages/landingPage.jsx' 
import Home from './pages/home.jsx'
import Estoque from './pages/estoque.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import { LogoutPage } from './pages/logoutPage.jsx'
import { Produtos } from './pages/produtos.jsx'
import { Usuarios } from './pages/usuarios.jsx'
import { Historico } from './pages/historico.jsx'
import { Configuracoes } from './pages/configs.jsx'
import { SearchProvider } from './components/Header/searchcontent.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/landingpage" replace />,
  },
  {
    path: "/logout-required",
    element: <LogoutPage />,
  },
  {
    path: "/landingpage", 
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // Rotas Protegidas
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/estoque",
    element: (
      <ProtectedRoute>
        <Estoque />
      </ProtectedRoute>
    ),
  },
  {
    path: "/produtos",
    element: (
      <ProtectedRoute>
        <Produtos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/usuarios",
    element: (
      <ProtectedRoute>
        <Usuarios />
      </ProtectedRoute>
    ),
  },
  {
    path: "/historico",
    element: (
      <ProtectedRoute>
        <Historico />
      </ProtectedRoute>
    ),
  },
  {
    path: "/configuracoes",
    element: (
      <ProtectedRoute>
        <Configuracoes />
      </ProtectedRoute>
    ),
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
  </StrictMode>
)



