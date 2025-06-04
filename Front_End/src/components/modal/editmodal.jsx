import { useState, useEffect } from "react";
import { FiX, FiSearch } from "react-icons/fi";

export const EditModal = ({ 
  isOpen, 
  onClose, 
  produto, 
  onSave, 
  onChange,
  categories = [],
  getCategoryId
}) => {
  // Estados existentes
  const [isSearchingCategory, setIsSearchingCategory] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  // Novo estado para guardar o produto inicial
  const [initialProduto, setInitialProduto] = useState(null);

  // Effect para guardar o estado inicial do produto quando o modal abrir
  useEffect(() => {
    if (isOpen && produto) {
      setInitialProduto({...produto});
    }
  }, [isOpen, produto]);

  if (!isOpen || !produto) return null;

  // Filtra as categorias baseado na pesquisa
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Função para alternar o modo de pesquisa
  const toggleCategorySearch = () => {
    setIsSearchingCategory(!isSearchingCategory);
    setCategorySearch('');
  };

  // Função para obter o ID da categoria atual do produto
  const getCurrentCategoryId = () => {
    if (getCategoryId) {
      return getCategoryId(produto) || '';
    }
    return produto.category_id || produto.categoryId || 
           (produto.category && typeof produto.category === 'object' ? produto.category.id : '') || '';
  };

  // Função modificada para lidar com o cancelamento
  const handleClose = () => {
    // Restaura o produto para o estado inicial
    if (initialProduto) {
      onChange(initialProduto);
    }
    // Reseta os estados do modal
    setIsSearchingCategory(false);
    setCategorySearch('');
    // Fecha o modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between">
          <h2 className="text-xl text-black font-semibold mb-4">
            Editar Produto
          </h2>
          <button
            onClick={handleClose}
            className="p-0 bg-white text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX size={28} />
          </button>
        </div>
        
        <form onSubmit={onSave} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={produto.name || ''}
              onChange={e => onChange({ ...produto, name: e.target.value })}
              className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            {isSearchingCategory ? (
              <div className="relative">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pesquisar categoria..."
                />
                <button
                  type="button"
                  onClick={toggleCategorySearch}
                  className="absolute right-1 px-3 py-1 bg-cinza-escuro top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
                >
                  <FiX size={25} />
                </button>
                {categorySearch && filteredCategories.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-cinza-escuro border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCategories.map((category) => (
                      <button
                        type="button"
                        key={category.id}
                        onClick={() => {
                          onChange({ 
                            ...produto, 
                            category_id: category.id,
                            categoryId: category.id
                          });
                          setIsSearchingCategory(false);
                          setCategorySearch('');
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-700 focus:outline-none"
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
                  value={getCurrentCategoryId()}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    onChange({ 
                      ...produto, 
                      category_id: categoryId ? parseInt(categoryId) : null,
                      categoryId: categoryId ? parseInt(categoryId) : null
                    });
                  }}
                  className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={toggleCategorySearch}
                  className="absolute right-1 px-3 py-1 top-1/2 bg-cinza-escuro -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
                >
                  <FiSearch size={25} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              type="number"
              value={produto.price || ''}
              onChange={e => onChange({ ...produto, price: parseFloat(e.target.value) || 0 })}
              className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              value={produto.stock || ''}
              onChange={e => onChange({ ...produto, stock: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={produto.description || ''}
              onChange={e => onChange({ ...produto, description: e.target.value })}
              className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Descrição do produto (opcional)"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};