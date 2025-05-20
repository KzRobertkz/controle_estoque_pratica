import React from 'react';

export const handleUpdateModal = async (e) => {
    const handleEdit = (produto) => {
        setEditingProduct(produto);
        setIsEditModalOpen(true);
    };
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3333/products/${editingProduct.id}`, editingProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const updatedProdutos = produtos.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      );
      setProdutos(updatedProdutos);
      
      setIsEditModalOpen(false);
      setEditingProduct(null);
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto');
    }
  };

export const EditModal = ({ 
  isOpen, 
  onClose, 
  produto, 
  onSave, 
  onChange 
}) => {
  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl text-black font-semibold mb-4">Editar Produto</h2>
        
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={produto.name}
              onChange={e => onChange({ ...produto, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              type="number"
              value={produto.price}
              onChange={e => onChange({ ...produto, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              value={produto.stock}
              onChange={e => onChange({ ...produto, stock: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};