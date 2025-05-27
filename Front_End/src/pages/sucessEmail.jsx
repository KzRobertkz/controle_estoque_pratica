import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function EmailSent() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = 'http://127.0.0.1:5173/landingpage'
    }, 5500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800 px-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h1 className="text-2xl font-bold mb-2">E-mail enviado com sucesso!</h1>
        <p className="text-sm mb-6">
          Sua mensagem foi enviada. Redirecionando para a página inicial em alguns segundos...
        </p>
        <div className="text-xs text-gray-500">Se não for redirecionado, <a href="http://127.0.0.1:5173/landingpage" className="underline text-blue-600">clique aqui</a>.</div>
      </div>
    </div>
  )
}
