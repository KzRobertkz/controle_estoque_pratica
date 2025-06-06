import { useState, useEffect } from 'react';
import { FiX, FiFilter, FiSearch } from 'react-icons/fi';

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
  const [categorySearch, setCategorySearch] = useState('');
  const [isSearchingCategory, setIsSearchingCategory] = useState(false);

  // Sincroniza filtros locais com os filtros externos
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  // Filtra as categorias baseado na pesquisa
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Função para alternar o modo de pesquisa
  const toggleCategorySearch = () => {
    setIsSearchingCategory(!isSearchingCategory);
    setCategorySearch('');
  };

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
      <div className="bg-white p-6 rounded-lg max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiFilter className="mr-2" />
            Filtrar Itens
          </h2>
          <button
            onClick={onClose}
            className="p-0 bg-white text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX size={28} />
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
              className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o código do item"
            />
          </div>

          {/* Filtro por Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            {isSearchingCategory ? (
              <div className="relative">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Pesquisar categoria..."
                />
                <button
                  onClick={toggleCategorySearch}
                  className="absolute right-1 px-3 py-1 bg-cinza-escuro top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
                >
                  <FiX size={25} />
                </button>
                {categorySearch && filteredCategories.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setLocalFilters({...localFilters, category: category.id.toString()});
                          setIsSearchingCategory(false);
                          setCategorySearch('');
                        }}
                        className="block w-full text-left px-4 py-2 rounded-none text-gray-400 hover:text-gray-700 hover:bg-blue-300 focus:outline-none"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <select
                  value={localFilters.category}
                  onChange={(e) => setLocalFilters({...localFilters, category: e.target.value})}
                  className="mt-1 text-gray-400 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option className='font-medium' value="">Todas as categorias</option>
                  {categories.map((category) => (
                    <option className='font-medium' key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleCategorySearch}
                  className="absolute right-1 px-3 py-1 top-1/2 bg-cinza-escuro -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
                >
                  <FiSearch size={25} />
                </button>
              </div>
            )}
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
                  className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Qtd. máx."
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex mt-6">
          <div className="flex space-x-3">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Limpar Filtros
            </button>
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