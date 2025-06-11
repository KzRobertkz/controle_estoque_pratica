import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dashboardimg from '../assets/dashboard.jpg'
import leftpart from '../assets/leftpart.png'
import rightTopPart from '../assets/rightpart.png'

import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { FiX } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('')
  const navigate = useNavigate()

  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Erro ao fazer login')
        return
      }

      // Salvas o token no localStorage
      localStorage.setItem('token', data.token)

      // Redireciona para a página inicial
      navigate('/home')
    } catch (err) {
      setError('Erro na conexão com o servidor')
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotPasswordMessage('')

    try {
      const response = await fetch('http://localhost:3333/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setForgotPasswordMessage('Email de recuperação enviado com sucesso!')
        setTimeout(() => {
          setShowForgotPasswordModal(false)
          setForgotPasswordEmail('')
          setForgotPasswordMessage('')
        }, 2000)
      } else {
        setForgotPasswordMessage(data.message || 'Erro ao enviar email de recuperação')
      }
    } catch (err) {
      setForgotPasswordMessage('Erro na conexão com o servidor')
    }
  }

  return (
    <>
      {/* Fontes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
        <div className="flex min-h-screen w-screen font-inter relative bg-cinza-escuro overflow-hidden">

          {/* Lado esquerdo - Hero Section (2/3 da tela) */}
          <div className='w-2/3 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden rounded-r-[1rem]'>
          
            {/* Background decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            
            <div className='relative z-10 flex flex-col justify-between h-full'>
              <div>
                <h2 className='text-2xl font-space-grotesk font-bold tracking-wide p-14'>ENTERPRISE LOGO</h2>
              </div>

              <div className='flex justify-center'>
                <div>
                  <h1 className='text-5xl font-poppins font-bold leading-tight mb-6 drop-shadow-lg'>
                    Developed for{' '}
                    <span className='font-extrabold bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-transparent drop-shadow-lg'>
                      Robert Christian
                    </span>
                  </h1>
                  <p className='text-xl font-manrope font-light text-blue-100 leading-relaxed drop-shadow-xl'>
                    See everything about your stock, view analytics and<br/>
                    expand your business from anywhere!
                  </p>
                </div>
              </div>

              {/* Imagens */}
              <div className='flex justify-end'>
                <div className="">
                  <img 
                    src={rightTopPart}
                    alt="rightpart preview" 
                    className="h-28 w-44"
                  />
                </div>
              </div>
              <div className='flex justify-end'>
                <div className="pt-56">
                  <img 
                    src={leftpart}
                    alt="leftpart preview" 
                    className="h-60 w-80"
                  />
                </div>
                <div className="w-2/3 pb-0">
                  <img 
                    src={dashboardimg}
                    alt="Dashboard preview" 
                    className="w-full h-auto rounded-l-lg shadow-2xl"
                  />
                </div>
              </div>
              
              {/* Footer */}
              <div className='text-sm pb-5 pt-8 flex justify-center font-manrope text-blue-200'>
                  © 2025 All rights reserved
              </div>

            </div>
          </div>

          {/* Lado direito - (1/3 da tela) */}
          <div className="w-1/3 relative flex items-center justify-center bg-cinza-escuro p-8 overflow-hidden">

            {/* Fundo decorativo com camadas e brilho suave */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2b2b2b] via-cinza-escuro to-[#1e1e1e] opacity-90 z-0"></div>
            <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-purple-700/10 rounded-full blur-3xl z-0"></div>
            <div className="absolute bottom-[-200px] right-[-96px] w-80 h-80 bg-blue-900/10 rounded-full blur-2xl z-0"></div>

            {/* Container do formulário */}
            <div className="w-full max-w-md relative z-10">
              <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-poppins font-bold text-gray-800 mb-2">Welcome Back</h2>
                  <p className="text-gray-500 font-manrope">Entre na sua conta</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-manrope">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-manrope font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-200 bg-cinza-escuro rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-inter placeholder-gray-400"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-manrope font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className='relative'>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        className="w-full px-4 py-3 border border-gray-200 bg-cinza-escuro  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-inter placeholder-gray-400"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span 
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        className='absolute inset-y-0 right-4 flex items-center cursor-pointer'
                      >
                        {showLoginPassword ? (
                          <FaEyeSlash className='text-blue-600 h-6 w-5' />
                        ) : (
                          <FaEye className='text-blue-600 h-5 w-5' />
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-1 text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-sm font-manrope text-blue-600 p-0 bg-transparent hover:text-blue-700 hover:underline focus:outline-none transition-colors duration-200"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-manrope font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Entrar
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm font-manrope text-gray-600">
                    Não tem uma conta?{' '}
                    <a href="/signup" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200">
                      Inscreva-se
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Modal Esqueci Minha Senha */}
          {showForgotPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-poppins font-bold text-gray-800">Recuperar Senha ⭐BETA</h3>
                  <button
                    onClick={() => {
                      setShowForgotPasswordModal(false)
                      setForgotPasswordEmail('')
                      setForgotPasswordMessage('')
                    }}
                    className="text-gray-400 hover:text-gray-600 bg-transparent p-0 transition-colors duration-200 focus:outline-none"
                  >
                    <FiX className="h-7 w-7" />
                  </button>
                </div>

                <p className="text-gray-600 font-manrope mb-6">
                  Digite seu email para receber as instruções de recuperação de senha.
                </p>

                {forgotPasswordMessage && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    forgotPasswordMessage.includes('sucesso') 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-sm font-manrope ${
                      forgotPasswordMessage.includes('sucesso') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {forgotPasswordMessage}
                    </p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword}>
                  <div className="mb-6">
                    <label className="block text-sm font-manrope font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-stone-300 focus:bg-cinza-escuro bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-inter placeholder-gray-400"
                      placeholder="your@email.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordModal(false)
                        setForgotPasswordEmail('')
                        setForgotPasswordMessage('')
                      }}
                      className="flex-1 py-3 px-4 bg-gray-200 text-gray-500 font-manrope font-semibold rounded-xl hover:bg-gray-300 focus:outline-none"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-manrope font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
    </>
  )
}