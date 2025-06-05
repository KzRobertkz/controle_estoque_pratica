import { useState, useEffect } from "react";
import { FiX, FiSearch, FiList } from "react-icons/fi";
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true
});

export const ChooseCategoryModal = ({ 
  isOpen, 
  onClose, 
  onCategorySelect,
  selectedCategoryId = ""
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategoryId);
  const [isSearchingCategory, setIsSearchingCategory] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await api.get('/categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
        throw new Error('Formato de resposta inválido');
      }
      
      setError('');
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setCategories([]);
      setError('Erro ao carregar categorias. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setLocalSelectedCategory(selectedCategoryId);
      setIsSearchingCategory(false);
      setCategorySearch('');
      setError('');
    }
  }, [isOpen, selectedCategoryId]);

  // Filtra as categorias baseado na pesquisa
  const filteredCategories = categories.filter(category =>
    category?.name?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Função para alternar o modo de pesquisa
  const toggleCategorySearch = () => {
    setIsSearchingCategory(!isSearchingCategory);
    setCategorySearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiList className="mr-2" />
            Escolher Categoria
          </h2>
          <button
            onClick={onClose}
            className="p-0 bg-white text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX size={28} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          {isSearchingCategory ? (
            <div className="relative">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full p-2 rounded-md bg-cinza-escuro border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Pesquisar categoria..."
              />
              <button
                onClick={toggleCategorySearch}
                className="absolute right-1 px-3 py-1 bg-cinza-escuro top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
              >
                <FiX size={25} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <select
                value={localSelectedCategory}
                onChange={(e) => {
                  setLocalSelectedCategory(e.target.value);
                  onCategorySelect(e.target.value);
                }}
                className="w-full p-2 text-gray-400 rounded-md bg-cinza-escuro border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
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

        {loading ? (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando categorias...</p>
          </div>
        ) : isSearchingCategory && filteredCategories.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-auto focus:outline-none">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategorySelect(category.id);
                  setLocalSelectedCategory(category.id);
                  setIsSearchingCategory(false);
                  onClose();
                }}
                className="w-full p-3 text-left rounded hover:bg-blue-300 hover:text-gray-700 bg-cinza-escuro border border-gray-300 text-gray-400 focus:outline-none"
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : isSearchingCategory ? (
          <p className="text-center text-gray-500 p-4">
            Nenhuma categoria encontrada
          </p>
        ) : null}

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancelar
          </button>
          {!isSearchingCategory && (
            <button
              onClick={() => {
                if (localSelectedCategory) {
                  onCategorySelect(localSelectedCategory);
                  onClose();
                }
              }}
              disabled={!localSelectedCategory}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                localSelectedCategory
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirmar Seleção
            </button>
          )}
        </div>
      </div>
    </div>
  );
};