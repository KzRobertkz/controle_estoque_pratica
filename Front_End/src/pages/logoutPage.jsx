import { useNavigate } from "react-router-dom"
import { MdOutlineSignalWifiConnectedNoInternet4 } from "react-icons/md";

export function LogoutPage() {
  const navigate = useNavigate()

  const handleGoToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="w-screen flex flex-col items-center justify-center min-h-screen bg-cinza-escuro px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <MdOutlineSignalWifiConnectedNoInternet4 className="text-5xl ml-48 mb-4 text-red-600"/>
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Você precisa estar logado para continuar.
        </h1>
        <button
          onClick={handleGoToLogin}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
        >
          Ir para a tela de login
        </button>
      </div>
    </div>
  )
}


