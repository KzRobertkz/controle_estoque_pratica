import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import signupDashboard from '../assets/signup_dashboard_image.svg'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmSignupPassword, setShowSignupConfirmPassword] = useState(false);

  // Função de validação de senha forte
  const validatePasswordStrength = (password) => {
    if (!password) return { isValid: false, score: 0, feedback: [] };

    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(criteria).filter(Boolean).length;
    const isValid = score >= 3; // Pelo menos 3 critérios

    const feedback = [
      { text: 'Pelo menos 8 caracteres', met: criteria.length },
      { text: 'Letra maiúscula', met: criteria.uppercase },
      { text: 'Letra minúscula', met: criteria.lowercase },
      { text: 'Número', met: criteria.numbers },
      { text: 'Caractere especial (!@#$%^&*)', met: criteria.special }
    ];

    let strengthText = '';
    let strengthColor = '';

    if (score < 2) {
      strengthText = 'Muito fraca';
      strengthColor = 'text-red-600';
    } else if (score < 3) {
      strengthText = 'Fraca';
      strengthColor = 'text-orange-600';
    } else if (score < 4) {
      strengthText = 'Boa';
      strengthColor = 'text-yellow-600';
    } else if (score < 5) {
      strengthText = 'Forte';
      strengthColor = 'text-green-600';
    } else {
      strengthText = 'Muito forte';
      strengthColor = 'text-green-700';
    }

    return { isValid, score, feedback, strengthText, strengthColor };
  };

  const passwordValidation = validatePasswordStrength(password);
  const passwordsMatch = confirmPassword === password;

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validação de senha forte
    if (!passwordValidation.isValid) {
      setError('A senha deve atender pelo menos 3 dos critérios de segurança')
      return
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    try {
      const response = await fetch('http://localhost:3333/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Erro ao cadastrar usuário')
        return
      }

      navigate('/login')
    } catch (err) {
      setError('Erro na conexão com o servidor')
    }
  }

  return (
    <>
      {/* Fontes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="flex min-h-screen w-screen font-inter relative bg-cinza-escuro overflow-hidden">

        {/* Lado direito - (1/3 da tela) */}
        <div className="w-1/3 relative flex items-center justify-center bg-cinza-escuro p-8 overflow-hidden">

          {/* Background decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2b2b2b] via-cinza-escuro to-[#1e1e1e] opacity-90 z-0"></div>
          <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-purple-700/10 rounded-full blur-3xl z-0"></div>
          <div className="absolute bottom-[-200px] left-[-96px] w-80 h-80 bg-blue-900/10 rounded-full blur-2xl z-0"></div>

          {/* Container do formulário */}
          <div className="w-full max-w-md relative z-10">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-poppins font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-500 font-manrope">Crie sua conta</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-manrope">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-manrope font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 bg-cinza-escuro rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-inter placeholder-gray-400"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 bg-cinza-escuro rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-inter placeholder-gray-400"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      className="w-full px-4 py-3 border border-gray-200 bg-cinza-escuro rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-inter placeholder-gray-400"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span 
                      onClick={() => setShowSignupPassword((prev) => !prev)}
                      className='absolute inset-y-0 right-4 flex items-center cursor-pointer'
                    >
                      {showSignupPassword ? (
                        <FaEyeSlash className='text-blue-600 h-6 w-5' />
                      ) : (
                        <FaEye className='text-blue-600 h-5 w-5' />
                      )}
                    </span>
                  </div>

                  {/* Indicador de força da senha */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordValidation.score < 2 ? 'bg-red-500' :
                              passwordValidation.score < 3 ? 'bg-orange-500' :
                              passwordValidation.score < 4 ? 'bg-yellow-500' :
                              passwordValidation.score < 5 ? 'bg-green-500' : 'bg-green-600'
                            }`}
                            style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-manrope font-medium ${passwordValidation.strengthColor}`}>
                          {passwordValidation.strengthText}
                        </span>
                      </div>
                      
                      {/* Critérios da senha */}
                      <div className="text-xs space-y-1 font-manrope">
                        {passwordValidation.feedback.map((criterion, index) => (
                          <div key={index} className={`flex items-center gap-1 ${
                            criterion.met ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            <span className="font-semibold">{criterion.met ? '✓' : '○'}</span>
                            <span>{criterion.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-manrope font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmSignupPassword ? 'text' : 'password'}
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-inter placeholder-gray-400 ${
                        confirmPassword && !passwordsMatch 
                          ? 'border-red-300  focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-200 bg-cinza-escuro'
                      }`}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span 
                      onClick={() => setShowSignupConfirmPassword((prev) => !prev)}
                      className='absolute inset-y-0 right-4 flex items-center cursor-pointer'
                    >
                      {showConfirmSignupPassword ? (
                        <FaEyeSlash className='text-blue-600 h-6 w-5' />
                      ) : (
                        <FaEye className='text-blue-600 h-5 w-5' />
                      )}
                    </span>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-red-600 text-xs mt-1 font-manrope">As senhas não coincidem</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-green-600 to-green-700 text-white font-manrope font-semibold py-3 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!passwordValidation.isValid || !passwordsMatch || !fullName || !email || !password || !confirmPassword}
              >
                Criar Conta
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm font-manrope text-gray-600">
                  Já tem uma conta?{' '}
                  <a href="/login" className="text-green-600 hover:text-green-700 hover:underline font-semibold transition-colors duration-200">
                    Entrar
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Lado esquerdo - Hero Section (2/3 da tela) */}
        <div className='w-2/3 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white relative overflow-hidden rounded-l-[1rem]'>
        
          {/* Background decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className='relative z-10 flex flex-col justify-between h-full'>
            <div>
              <h2 className='text-2xl font-space-grotesk font-bold tracking-wide p-14'>ENTERPRISE LOGO</h2>
            </div>

            <div className='flex justify-center'>
              <div className=''>
                <h1 className='text-5xl font-poppins font-bold leading-tight mb-6 drop-shadow-lg'>
                  join us and enjoy the whole system
                </h1>
                <p className='text-xl font-manrope font-light text-green-100 leading-relaxed drop-shadow-xl'>
                  Start managing your business today! <br />
                  Create your account and unlock all the features we have to offer.
                </p>
              </div>
            </div>

            {/* Imagens */}
            <div className="w-2/3 pb-0 bg-green-800 rounded-r-lg">
              <img 
                src={signupDashboard}
                alt="Analytics Dashboard preview" 
                className="w-full h-auto rounded-r-lg shadow-2xl"
              />
            </div>
            
            {/* Footer */}
            <div className='text-sm pb-5 pt-8 flex justify-center font-manrope text-green-200'>
                © 2025 All rights reserved
            </div>

          </div>
        </div>
      </div>
    </>
  )
}