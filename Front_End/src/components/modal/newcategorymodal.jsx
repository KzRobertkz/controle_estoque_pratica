import { useState, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

// Modal para criar nova categoria
export const CreateCategoryModal = ({ 
  isOpen, 
  onClose, 
  categoryName,
  setCategoryName,
  categoryDescription,
  setCategoryDescription,
  onSubmit,
  isSubmitting
}) => {
  const [error, setError] = useState('');

  // Limpa os estados quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setCategoryName('');
      setCategoryDescription('');
      setError('');
    }
  }, [isOpen, setCategoryName, setCategoryDescription]);

  // Função para lidar com o submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!categoryName.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    try {
      await onSubmit(e);
    } catch (err) {
      setError(err.message || 'Erro ao criar categoria');
    }
  };

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
            className="text-gray-500 bg-white p-0 hover:text-gray-700 transition-colors focus:outline-none"
            disabled={isSubmitting}
          >
            <FiX size={28} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Nome da Categoria */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Categoria *
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 bg-cinza-escuro border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Eletrônicos, Roupas, Livros..."
              required
              disabled={isSubmitting}
              maxLength={255}
            />
          </div>

          {/* Descrição da Categoria */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              className="w-full px-3 py-2 bg-cinza-escuro border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descreva brevemente esta categoria..."
              rows={3}
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="text-xs text-gray-600 mt-1">
              {categoryDescription.length}/500 caracteres
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting || !categoryName.trim()}
            >
              {isSubmitting ? 'Criando...' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};