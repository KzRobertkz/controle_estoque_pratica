import Header from "../components/header"
import { Sidebar } from "../components/Sidebar/sidebar"
import { FiSettings, FiAlertTriangle } from "react-icons/fi"

export const Configuracoes = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-auto mt-20 w-full scrollbar-hide">
          <div className='border-b border-stone-400 px-4 mb-4 pb-4 sticky bg-white z-10'>
            <div className='flex items-center justify-between p-0.5'>
              <div>
                <h3 className='flex items-center gap-3 py-6 font-semibold text-xl text-stone-600'>
                  <FiSettings className="text-stone-500 text-2xl" />
                  Configurações do Sistema
                </h3>
              </div>
            </div>
          </div>

        {/* Área de conteúdo com rolagem */}
          <div className='px-4'>
            <div className='grid grid-cols-12 gap-4 w-full'>
              <div className='col-span-12 p-4 border border-stone-400 rounded-md w-full'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold flex items-center gap-3 text-stone-700'>
                    Configurações Gerais
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 border border-stone-200 w-full">
                      <p className="text-base text-stone-600">Descrição da configuração {i + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='px-4 py-4'>
            <div className='grid grid-cols-12 gap-4 w-full'>
              <div className='col-span-12 p-4 border border-stone-400 rounded-md w-full'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold flex items-center gap-3 text-stone-700'>
                    Configurações do tema
                  </h3>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
                      <button className="text-sm p-2 font-medium">switch</button>
                      <p className="text-base text-stone-600">Claro ou Escuro</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
                      <button className="text-sm p-2 font-medium">Cores</button>
                      <p className="text-base text-stone-600">Escolha uma cor tema</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <FiAlertTriangle className="text-red-500 text-2xl" />
              <h3 className="text-xl font-bold text-red-500">Área de Risco</h3>
            </div>
            
            <div className='grid grid-cols-12 gap-4 w-full'>
              <div className='col-span-12 p-4 border-2 border-red-500 rounded-md w-full bg-red-50'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold flex items-center gap-3 text-stone-700'>
                    Configurações do Usuário
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-50 transition-colors duration-200">
                    <button className="text-sm p-2 font-medium">Editar senha</button>
                    <p className="text-base text-stone-600">Definir uma nova senha</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-50 transition-colors duration-200">
                    <button className="text-sm p-2 font-medium">Editar Nome Completo</button>
                    <p className="text-base text-stone-600">Editar o nome completo</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-50 transition-colors duration-200">
                    <button className="text-sm p-2 font-medium">Editar E-mail</button>
                    <p className="text-base text-stone-600">Editar o endereço de E-mail</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-red-400 w-full hover:bg-red-50 transition-colors duration-200">
                    <button className="text-sm bg-red-500 p-2 font-medium hover:bg-red-700 hover:text-red-300">Excluir Usuário</button>
                    <p className="text-base text-stone-600">Excluir usuário por completo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}