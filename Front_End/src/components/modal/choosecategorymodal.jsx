import { useState, useEffect } from "react";
import { FiX, FiSearch } from "react-icons/fi";
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
  // Inicialize categories como um array vazio
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

      // Log para debug
      console.log('Resposta bruta:', response);
      console.log('Dados da resposta:', response.data);

      // Garante que categories seja sempre um array
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
      setCategories([]); // Garante que categories seja um array vazio em caso de erro
      setError('Erro ao carregar categorias. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedCategory(selectedCategoryId);
      setIsSearchingCategory(false);
      setCategorySearch('');
      setError('');
      fetchCategories();
    }
  }, [isOpen, selectedCategoryId]);

  // Filtra as categorias baseado na pesquisa
  const filteredCategories = categories.filter(category =>
    category?.name?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Escolher Categoria</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar categoria..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando categorias...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategorySelect(category.id);
                  onClose();
                }}
                className={`w-full p-3 text-left rounded hover:bg-gray-100 ${
                  localSelectedCategory === category.id.toString() ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                } border`}
              >
                {category.name}
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500 p-4">
              {categorySearch ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria disponível'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};