import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:3333/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Erro ao cadastrar')
        return
      }

      // Salva o token e redireciona
      localStorage.setItem('token', data.token.token)
      navigate('/home')
    } catch (err) {
      setError('Erro na conexão com o servidor')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Cadastro</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4 text-blue-500">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6 text-blue-500">
          <label className="block mb-1">Senha</label>
          <input
            type="password"
            required
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Cadastrar
        </button>

        <p className="mt-4 text-sm text-center">
            Já tem conta? <a href="/login" className="text-blue-600 underline">Faça login</a>
        </p>

      </form>
    </div>
  )
}
