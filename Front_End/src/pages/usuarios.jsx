import Header from "../components/header"
import { Sidebar } from "../components/Sidebar/sidebar"
import { FiUsers } from "react-icons/fi"

export const Usuarios = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(100vh-6rem)] overflow-y-scroll mt-20 scrollbar-hide">
          <div className='border-b border-stone-400 px-4 mb-4 pb-4 sticky top-0 bg-white z-10'>
            <div className='flex items-center justify-between p-0.5'>
              <div>
                <h3 className='flex items-center gap-1.5 py-5 font-medium text-stone-600'>
                  <FiUsers className="text-stone-500 text-xl" />
                  Lista de Usuários
                </h3>
              </div>
            </div>
          </div>

          <div className='px-2'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12 p-4 border border-stone-400 rounded-md'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-sm font-semibold flex items-center gap-2'>
                    Usuários Cadastrados
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 border border-stone-200">
                      <p className="text-stone-600">Usuário {i + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}