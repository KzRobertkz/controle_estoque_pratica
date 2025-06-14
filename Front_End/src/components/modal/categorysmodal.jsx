import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiTrash2, FiPlus, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ManageCategorysModal = ({ 
  isOpen, 
  onClose, 
  onCategoryChange 
}) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const api = axios.create({
    baseURL: "http://localhost:3333",
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Modificar a função fetchCategories para ordenar por ID
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/categories");
      const sortedCategories = (response.data.data || response.data)
        .sort((a, b) => b.id - a.id); // Ordena por ID decrescente
      setCategories(sortedCategories);
      setError('');
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      description: category.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: '', description: '' });
  };

  const handleUpdate = async (categoryId) => {
    try {
      if (!editForm.name.trim()) {
        setError('Nome da categoria é obrigatório');
        return;
      }

      await api.put(`/categories/${categoryId}`, editForm);
      
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, ...editForm } : cat
      ));
      
      toast.success('Categoria atualizada com sucesso!');
      
      setEditingCategory(null);
      setEditForm({ name: '', description: '' });
      
      if (onCategoryChange) onCategoryChange();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar categoria');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Categoria excluída com sucesso!');
      
      if (onCategoryChange) onCategoryChange();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir categoria');
    }
  };

  // Modificar o handleClose para recarregar a página
  const handleClose = () => {
    onClose();
    window.location.reload();
  };

  // Função para calcular os itens da página atual
  const getCurrentPageItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return categories.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Função para mudar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Cálculo do total de páginas
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Gerar array com números das páginas
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiPlus className="mr-2" />
            Gerenciar Categorias
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 p-0 bg-white hover:text-gray-700 transition-colors focus:outline-none"
          >
            <FiX size={28} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Carregando categorias...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {getCurrentPageItems().map(category => (
                <div key={category.id} className="border border-gray-300 rounded-lg p-4">
                  {editingCategory?.id === category.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 rounded bg-cinza-escuro focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Nome da categoria"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 rounded bg-cinza-escuro focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Descrição (opcional)"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none" 
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-xl text-zinc-700">{category.name}</h3>
                          {category.description && (
                            <p className="text-gray-700 text-lg mt-1">{category.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEdit(category)}
                            className="p-0 bg-white text-gray-600 hover:text-blue-600 focus:outline-none"
                            title="Editar"
                          >
                            <FiEdit2 className='text-2xl'/>
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-0 bg-white text-gray-600 hover:text-red-600 focus:outline-none"
                            title="Excluir"
                          >
                            <FiTrash2 className='text-2xl'/>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded focus:outline-none ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Anterior
                </button>

                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-3 py-1 rounded focus:outline-none ${
                      currentPage === number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded focus:outline-none ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Próximo
                </button>
              </div>
            )}

            {/* Informação sobre total de itens */}
            <div className="text-center text-sm text-gray-500 mt-4">
              Mostrando {getCurrentPageItems().length} de {categories.length} categorias
            </div>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};
