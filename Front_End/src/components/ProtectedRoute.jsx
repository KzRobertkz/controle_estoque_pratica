import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token') // ou onde quer que salve o token

  if (!token) {
    return <Navigate to="/logout-required" replace />
  }

  return children
}