import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header/header'
import { Sidebar } from '../components/Sidebar/sidebar'
import { FiUsers } from 'react-icons/fi'

export const Usuarios = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          setError('Token não encontrado. Por favor, faça login.')
          setLoading(false)
          return
        }

        const response = await axios.get('http://localhost:3333/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const sortedUsers = response.data.sort((a, b) => a.id - b.id)
        setUsers(sortedUsers)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao buscar usuários:', err)
        
        if (err.response?.status === 401) {
          setError('Sessão expirada. Por favor, faça login novamente.')
        } else {
          setError('Erro ao carregar usuários. Tente novamente mais tarde.')
        }
        
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-600 font-semibold">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-scroll mt-20 scrollbar-hide">
          <div className='border-b border-stone-400 px-4 mb-4 pb-4 sticky top-0 bg-white z-10'>
            <div className='flex items-center justify-between p-0.5'>
              <div>
                <h3 className='flex items-center gap-3 py-6 font-semibold text-xl text-stone-600'>
                  <FiUsers className="text-stone-500 text-2xl" />
                  Lista de Usuários
                </h3>
              </div>
            </div>
          </div>

          <div className='px-6'>
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-12 p-6 border border-stone-400 rounded-lg'>
                <div className='mb-6 flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-stone-800'>
                    Usuários Cadastrados ( {users.length} )
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div 
                      key={user.id}
                      className="bg-white rounded-lg p-4 border border-stone-200 hover:bg-stone-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-stone-900">
                            {index === 0 ? 'Gerente' : 'Usuário'} - {user.fullName}
                          </p>
                          <p className="text-sm text-stone-700">Email: {user.email}</p>
                          <p className="text-xs text-stone-600">Customer ID: {user.id}</p>
                        </div>
                        {index === 0 && (
                          <span className="ml-20 px-3 py-2 bg-blue-100 border border-blue-700 text-blue-800 text-sm rounded-full">
                            Gerente / Chefe
                          </span>
                        )}
                        {index >= 1 && (
                          <span className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Funcionário
                          </span>
                        )}
                      </div>
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