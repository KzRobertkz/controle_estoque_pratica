import { useState, useEffect } from 'react'
import { useSearch } from '../components/Header/searchcontent'
import Header from "../components/Header/header"
import { Sidebar } from "../components/Sidebar/sidebar"
import { FiSettings, FiAlertTriangle } from "react-icons/fi"
import { PasswordModal, NameModal, EmailModal } from '../components/modal/ConfigModals'

export const Configuracoes = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { hideSearch, setHideSearch } = useSearch()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isNameModalOpen, setIsNameModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      const data = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      }
      setUserData(data)
    }
    fetchUserData()
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleSearch = () => {
    const newValue = !hideSearch
    setHideSearch(newValue)
    localStorage.setItem('hideSearch', JSON.stringify(newValue))
  }

  const handlePasswordSubmit = () => {
    console.log('Password updated:', newPassword)
    setIsPasswordModalOpen(false)
  }

  const handleNameSubmit = () => {
    console.log('Name updated:', newName)
    setIsNameModalOpen(false)
  }

  const handleEmailSubmit = () => {
    console.log('Email updated:', newEmail)
    setIsEmailModalOpen(false)
  }

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

          <div className='px-4'>
            <div className='grid grid-cols-12 gap-4 w-full'>
              <div className='col-span-12 p-4 border border-stone-400 rounded-md w-full'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-bold flex items-center gap-3 text-stone-700'>
                    Configurações Gerais
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className='text-stone-700 font-medium'>Ocultar Pesquisar</p>
                        <p className="text-base text-stone-500">Oculta a Barra de pesquisa no cabeçalho</p>
                      </div>
                      <button 
                        onClick={toggleSearch}
                        className={`relative inline-flex ml-3 h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
                          ${hideSearch ? 'bg-blue-600' : 'bg-stone-200'}`}
                      >
                        <span
                          className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out
                            ${hideSearch ? 'left-[calc(100%-1.4rem)]' : 'left-0.5 '}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='px-4 py-4'>
            <div className='grid grid-cols-12 gap-4 w-full'>
              <div className='col-span-12 p-4 border border-stone-400 rounded-md w-full'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-bold flex items-center gap-3 text-stone-700'>
                    Configurações do tema
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-medium text-stone-700">Modo {isDarkMode ? 'Claro' : 'Escuro'}</p>
                        <p className="text-sm text-stone-500">Alterar aparência do sistema</p>
                      </div>
                      
                      <button 
                        onClick={toggleTheme}
                        className={`relative inline-flex ml-3 h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
                          ${isDarkMode ? 'bg-blue-600' : 'bg-stone-200'}`}
                      >
                        <span
                          className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out
                            ${isDarkMode ? 'left-[calc(100%-1.4rem)]' : 'left-0.5'}`}
                        />
                      </button>
                    </div>
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
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                    <button 
                      className="text-sm p-2 font-medium hover:bg-zinc-700 hover:text-gray-200"
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      Editar senha
                    </button>
                    <p className="text-base text-stone-800">Definir uma nova senha</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                    <button 
                      className="text-sm p-2 font-medium hover:bg-zinc-700 hover:text-gray-200"
                      onClick={() => setIsNameModalOpen(true)}
                    >
                      Editar Nome Completo
                    </button>
                    <p className="text-base text-stone-800">Editar o nome completo</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                    <button 
                      className="text-sm p-2 font-medium hover:bg-zinc-700 hover:text-gray-200"
                      onClick={() => setIsEmailModalOpen(true)}
                    >
                      Editar E-mail
                    </button>
                    <p className="text-base text-stone-800">Editar o endereço de E-mail</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-red-400 w-full hover:bg-red-100 transition-colors duration-200">
                    <button className="text-sm bg-red-500 p-2 font-medium hover:bg-red-700 hover:text-red-300">Excluir Usuário</button>
                    <p className="text-base text-stone-800">Excluir usuário por completo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={handlePasswordSubmit}
      />

      <NameModal 
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        currentName={userData?.name}
        newName={newName}
        setNewName={setNewName}
        onSubmit={handleNameSubmit}
      />

      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={userData?.email}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        onSubmit={handleEmailSubmit}
      />
    </div>
  )
}