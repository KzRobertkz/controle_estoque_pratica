import Header from "../components/header"
import { Sidebar } from "../components/Sidebar/sidebar"

export const Usuarios = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="bg-white rounded-lg shadow-sm min-h-full p-4 mt-20">
          <div className="mb-4">
            <h3 className="flex items-center gap-1.5 font-medium text-stone-600">
              Lista de Usuários
            </h3>
          </div>
          
          {/* Conteúdo da página */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h1>Página de Usuários</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}