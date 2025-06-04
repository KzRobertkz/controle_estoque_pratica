
export const EditModal = ({ 
  isOpen, 
  onClose, 
  produto, 
  onSave, 
  onChange,
  categories = [],
  getCategoryId
}) => {
  if (!isOpen || !produto) return null;

  // Função para obter o ID da categoria atual do produto
  const getCurrentCategoryId = () => {
    if (getCategoryId) {
      return getCategoryId(produto) || '';
    }
    // Fallback: tentar obter o ID da categoria de diferentes propriedades
    return produto.category_id || produto.categoryId || 
           (produto.category && typeof produto.category === 'object' ? produto.category.id : '') || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl text-black font-semibold mb-4">Editar Produto</h2>
        
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={produto.name || ''}
              onChange={e => onChange({ ...produto, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <select
              value={getCurrentCategoryId()}
              onChange={e => {
                const categoryId = e.target.value;
                // Atualizar o produto com o novo category_id
                onChange({ 
                  ...produto, 
                  category_id: categoryId ? parseInt(categoryId) : null,
                  categoryId: categoryId ? parseInt(categoryId) : null
                });
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              type="number"
              value={produto.price || ''}
              onChange={e => onChange({ ...produto, price: parseFloat(e.target.value) || 0 })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={produto.description || ''}
              onChange={e => onChange({ ...produto, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Descrição do produto (opcional)"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
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