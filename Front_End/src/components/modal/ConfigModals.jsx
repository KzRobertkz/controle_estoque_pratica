import React from 'react';

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
        <h3 className="text-xl font-bold text-stone-700 mb-4">Alterar Senha</h3>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border focus:outline-none border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
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
        <h3 className="text-xl font-bold text-stone-700 mb-4">Alterar Nome</h3>
        <form onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Atual</label>
            <input
              type="text"
              value={currentName || ''}
              className="mt-1 block w-full rounded-md border text-black border-gray-500 p-2 bg-gray-200"
              disabled
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">Novo Nome</label>
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

export const EmailModal = ({ 
  isOpen, 
  onClose, 
  currentEmail, 
  newEmail, 
  setNewEmail, 
  onSubmit 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl text-stone-700 font-bold mb-4">Alterar E-mail</h3>
        <form onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail Atual</label>
            <input
              type="email"
              value={currentEmail || ''}
              className="mt-1 block w-full rounded-md border text-black border-gray-500 p-2 bg-gray-200"
              disabled
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">Novo E-mail</label>
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