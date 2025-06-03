import { useState, useEffect } from 'react';
import { FiX, FiFilter } from 'react-icons/fi';

export const FilterModal = ({ 
  isOpen, 
  onClose, 
  filters,
  setFilters,
  categories,
  onApplyFilters,
  onClearFilters
}) => {
  const [localFilters, setLocalFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    id: ''
  });

  // Sincroniza filtros locais com os filtros externos
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: '',
      id: ''
    };
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
    onClearFilters();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiFilter className="mr-2" />
            Filtrar Itens
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Filtro por ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código do Item
            </label>
            <input
              type="text"
              value={localFilters.id}
              onChange={(e) => setLocalFilters({...localFilters, id: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o ID do item"
            />
          </div>

          {/* Filtro por Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => setLocalFilters({...localFilters, category: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Faixa de Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faixa de Preço
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={localFilters.minPrice}
                  onChange={(e) => setLocalFilters({...localFilters, minPrice: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Preço mín."
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex items-center text-gray-600 mt-1">até</div>
              <div className="flex-1">
                <input
                  type="number"
                  value={localFilters.maxPrice}
                  onChange={(e) => setLocalFilters({...localFilters, maxPrice: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Preço máx."
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Filtro por Faixa de Estoque/Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faixa de Estoque
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={localFilters.minStock}
                  onChange={(e) => setLocalFilters({...localFilters, minStock: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Qtd. mín."
                  min="0"
                />
              </div>
              <div className="flex items-center text-gray-600 mt-1">até</div>
              <div className="flex-1">
                <input
                  type="number"
                  value={localFilters.maxStock}
                  onChange={(e) => setLocalFilters({...localFilters, maxStock: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Qtd. máx."
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Limpar Filtros
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};