import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { FaEye , FaEyeSlash } from "react-icons/fa6";

// Modal para mudar a senha do usuário
export const PasswordModal = ({ 
  isOpen, 
  onClose, 
  newPassword, 
  currentPassword,
  setNewPassword, 
  confirmPassword, 
  setConfirmPassword, 
  onSubmit 
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-bold text-stone-700 mb-4">
          Alterar Senha
        </h3>
        
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            {/* Senha atual */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha atual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword || ''}
                  className="mt-1 block w-full rounded-md border text-black border-gray-500 p-2 bg-gray-200"
                  disabled
                />
                <span
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash className="text-blue-600 h-6 w-5" />
                  ) : (
                    <FaEye className="text-blue-600 h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Nova Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
                  required
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="text-blue-500 h-6 w-5" />
                  ) : (
                    <FaEye className="text-blue-500 h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-blue-500 h-6 w-5" />
                  ) : (
                    <FaEye className="text-blue-500 h-5 w-5" />
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium focus:outline-none text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium focus:outline-none text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para mudar o nome completo do usuário
export const NameModal = ({ 
  isOpen, 
  onClose, 
  currentName, 
  newName, 
  setNewName, 
  onSubmit 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-bold text-stone-700 mb-4">
          Alterar Nome
        </h3>
        
        <form onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome Atual
            </label>
            <input
              type="text"
              value={currentName || ''}
              className="mt-1 block w-full rounded-md border text-black border-gray-500 p-2 bg-gray-200"
              disabled
            />
            
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Novo Nome
            </label>
            <input
              type="text"
              value={newName}
              placeholder='Digite o novo nome'
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium focus:outline-none text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium focus:outline-none text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para mudar o email do usuário

export const EmailModal = ({
  isOpen,
  onClose,
  newEmail,
  setNewEmail,
  onSubmit,
  isSubmitting
}) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [error, setError] = useState('');

  // Busca o email atual quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      fetchCurrentEmail();
    } else {
      // Limpa os estados quando o modal é fechado
      setCurrentEmail('');
      setError('');
      setNewEmail('');
    }
  }, [isOpen, setNewEmail]);

  const fetchCurrentEmail = async () => {
    setIsLoadingEmail(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch('http://localhost:3333/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos no modal:', data); // Para debug
      
      // CORREÇÃO: Acessar o email através de data.user.email
      const email = data.user?.email || data.email || 'Não informado';
      setCurrentEmail(email);
      
    } catch (err) {
      console.error('Erro ao buscar email atual:', err);
      setError('Erro ao carregar email atual');
      setCurrentEmail('Erro ao carregar');
    } finally {
      setIsLoadingEmail(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Alterar E-mail
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={fetchCurrentEmail}
              className="ml-2 text-sm underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail Atual
            </label>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-500 min-h-[2.5rem] flex items-center">
              {isLoadingEmail ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-500 text-sm">Carregando...</span>
                </div>
              ) : (
                <span className="text-gray-700 font-medium">
                  {currentEmail}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Novo E-mail
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o novo e-mail"
              required
              disabled={isLoadingEmail || isSubmitting}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 focus:outline-none bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded focus:outline-none hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || isLoadingEmail || !currentEmail || currentEmail === 'Erro ao carregar'}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Modal para excluir o usuário
export const DeleteUserModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Digite sua senha para confirmar a exclusão');
      return;
    }
    
    try {
      await onConfirm(password);
      setPassword('');
      setError('');
    } catch (err) {
      setError(err.message || 'Erro ao excluir usuário');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <FiTrash2 className="text-red-500 text-2xl" />
          <h2 className="text-xl font-bold text-red-600">
            Excluir Usuário
          </h2>
        </div>
        
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium mb-2">
            ⚠️ Ação Irreversível
          </p>
          <p className="text-sm text-red-600">
            Esta ação não pode ser desfeita. Todos os seus dados serão 
            permanentemente removidos do sistema e você será desconectado.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digite sua senha para confirmar:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Sua senha atual"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Excluindo...
                </>
              ) : (
                'Excluir Definitivamente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};