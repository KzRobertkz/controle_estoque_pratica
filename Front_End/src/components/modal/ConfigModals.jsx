import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

// Modal para mudar a senha do usuário
export const PasswordModal = ({ 
  isOpen, 
  onClose, 
  newPassword, 
  setNewPassword, 
  confirmPassword, 
  setConfirmPassword, 
  onSubmit 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-bold text-stone-700 mb-4">
          Alterar Senha
        </h3>
        
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 p-2"
                required
              />
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
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 p-2"
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
  currentEmail,
  newEmail,
  setNewEmail,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl text-stone-700 font-bold mb-4">
          Alterar E-mail
        </h3>

        <form onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-mail Atual
            </label>
            <input
              type="email"
              value={currentEmail || ''}
              className="mt-1 block w-full rounded-md border text-black border-gray-500 p-2 bg-gray-200"
              disabled
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Novo E-mail
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none"
              required
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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