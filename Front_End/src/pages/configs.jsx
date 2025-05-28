import { useState, useEffect } from 'react';
import { useSearch } from '../components/Header/searchcontent';
import Header from '../components/Header/header';
import { Sidebar } from '../components/Sidebar/sidebar';
import { FiSettings, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { 
  PasswordModal, 
  NameModal, 
  EmailModal, 
  DeleteUserModal 
} from '../components/modal/ConfigModals';

export const Configuracoes = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3333/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        if (res.ok) setUserData(data);
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
      }
    };

    fetchUser();
  }, []);


  // Estados principais
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados dos modais
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Estados dos formulários
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  
  // Hook de busca
  const { hideSearch, setHideSearch } = useSearch();

  // Funções de toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSearch = () => {
    const newValue = !hideSearch;
    setHideSearch(newValue);
    localStorage.setItem('hideSearch', JSON.stringify(newValue));
  };

  // Handlers dos modais
  const handlePasswordSubmit = () => {
    console.log('Password updated:', newPassword);
    setIsPasswordModalOpen(false);
  };

  const handleNameSubmit = () => {
    console.log('Name updated:', newName);
    setIsNameModalOpen(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/auth/update-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Trata diferentes tipos de erro
        if (response.status === 400 && data.errors) {
          // Erro de validação
          throw new Error(data.errors.email?.[0] || data.message || 'Email inválido');
        } else if (data.message?.includes('já está em uso') || data.message?.includes('already')) {
          throw new Error('Este email já está em uso por outro usuário');
        } else {
          throw new Error(data?.message || 'Erro ao alterar email');
        }
      }

      // Atualiza os dados do usuário
      setUserData(prevData => ({
        ...prevData,
        email: newEmail
      }));

      // Limpa campo e fecha o modal
      setNewEmail('');
      setIsEmailModalOpen(false);

      alert('Email alterado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao alterar email:', error.message);
      // O erro será tratado pelo modal
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDeleteUser = async (password) => {
    setIsDeleting(true);
    
    try {
      // Faz a requisição para o backend
      const response = await fetch('/auth/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao excluir usuário');
      }

      // Remove o token do localStorage
      localStorage.removeItem('token');
      
      // Redireciona para a página de login ou inicial
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      
      // Se for erro 404, a rota não existe
      if (error.message && error.message.includes('404')) {
        throw new Error(
          'Rota de exclusão não encontrada. Verifique se a rota foi configurada no backend.'
        );
      }
      
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-auto mt-20 w-full scrollbar-hide">
          {/* Cabeçalho da página */}
          <div className="border-b border-stone-400 px-4 mb-4 pb-4 sticky bg-white z-10">
            <div className="flex items-center justify-between p-0.5">
              <div>
                <h3 className="flex items-center gap-3 py-6 font-semibold text-xl text-stone-600">
                  <FiSettings className="text-stone-500 text-2xl" />
                  Configurações do Sistema
                </h3>
              </div>
            </div>
          </div>

          {/* Configurações Gerais */}
          <div className="px-4">
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12 p-4 border border-stone-400 rounded-md w-full">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-3 text-stone-700">
                    Configurações Gerais
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-stone-700 font-medium">
                          Ocultar Pesquisar
                        </p>
                        <p className="text-base text-stone-500">
                          Oculta a Barra de pesquisa no cabeçalho
                        </p>
                      </div>
                      
                      <button 
                        onClick={toggleSearch}
                        className={`relative inline-flex ml-3 h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
                          ${hideSearch ? 'bg-blue-600' : 'bg-stone-200'}`}
                      >
                        <span
                          className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out
                            ${hideSearch ? 'left-[calc(100%-1.4rem)]' : 'left-0.5'}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações do Tema */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12 p-4 border border-stone-400 rounded-md w-full">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-3 text-stone-700">
                    Configurações do Tema
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-medium text-stone-700">
                          Modo {isDarkMode ? 'Claro' : 'Escuro'}
                        </p>
                        <p className="text-sm text-stone-500">
                          Alterar aparência do sistema
                        </p>
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
          
          {/* Área de Risco - Configurações do Usuário */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <FiAlertTriangle className="text-red-500 text-2xl" />
              <h3 className="text-xl font-bold text-red-500">
                Área de Risco
              </h3>
            </div>
            
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12 p-4 border-2 border-red-500 rounded-md w-full bg-red-50">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-3 text-stone-700">
                    Configurações do Usuário
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {/* Editar Senha */}
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                    <button 
                      className="text-sm p-2 font-medium focus:outline-none hover:bg-zinc-700 hover:text-gray-200"
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      Editar senha
                    </button>
                    <p className="text-base text-stone-800">
                      Definir uma nova senha
                    </p>
                  </div>
                  
                  {/* Editar Nome */}
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                    <button 
                      className="text-sm p-2 font-medium focus:outline-none hover:bg-zinc-700 hover:text-gray-200"
                      onClick={() => setIsNameModalOpen(true)}
                    >
                      Editar Nome Completo
                    </button>
                    <p className="text-base text-stone-800">
                      Editar o nome completo
                    </p>
                  </div>
                  
                  {/* Editar Email */}
                  <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                    <button 
                      className="text-sm p-2 font-medium focus:outline-none hover:bg-zinc-700 hover:text-gray-200"
                      onClick={() => setIsEmailModalOpen(true)}
                    >
                      Editar E-mail
                    </button>
                    <p className="text-base text-stone-800">
                      Editar o endereço de E-mail
                    </p>
                  </div>
                  
                  {/* Excluir Usuário */}
                  <div className="bg-white rounded-lg p-6 border border-red-400 w-full hover:bg-red-100 transition-colors duration-200">
                    <button 
                      className="text-sm bg-red-500 text-white p-2 font-medium hover:bg-red-700 transition-colors rounded-md flex items-center gap-2"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <FiTrash2 className="text-white" />
                      Excluir Usuário
                    </button>
                    <p className="text-base text-stone-800 mt-2">
                      Excluir usuário por completo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
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
        currentEmail={userData?.email || ''}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        onSubmit={handleEmailSubmit}
        isSubmitting={isSubmitting}
      />


      <DeleteUserModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        isLoading={isDeleting}
      />
    </div>
  );
};