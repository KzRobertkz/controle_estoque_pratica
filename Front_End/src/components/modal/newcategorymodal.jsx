import { useState, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

// Modal para criar nova categoria
export const CreateCategoryModal = ({ 
  isOpen, 
  onClose, 
  categoryName,
  setCategoryName,
  onSubmit,
  isSubmitting
}) => {
  const [error, setError] = useState('');

  // Limpa os estados quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setCategoryName('');
      setError('');
    }
  }, [isOpen, setCategoryName,]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiPlus className="mr-2" />
            Nova Categoria
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <FiX size={20} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
            {/* Nome da Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o nome da categoria"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 mt-6">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isSubmitting}
                >
                Cancelar
                </button>
                <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                >
                {isSubmitting ? 'Criando...' : 'Criar Categoria'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};