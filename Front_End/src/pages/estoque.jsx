// React e hooks
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Bibliotecas externas
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import Header from "../components/Header/header";
import { Sidebar } from "../components/Sidebar/sidebar";
import { ChooseCategoryModal } from "../components/modal/choosecategorymodal";
import { GlobalSettingsModal } from "../components/modal/globalsettingsmodal";

function Estoque() {
  // 1. ESTADOS
  // Estados de UI
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estados de Produtos
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    validate_date: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Estados de Categoria
  const [isChooseCategoryModalOpen, setIsChooseCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  
  // Estados de Paginação
  const [meta, setMeta] = useState({ 
    currentPage: 1, 
    lastPage: 1, 
    total: 0, 
    perPage: 10, 
    firstPage: 1 
  });
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  // Estados do Modal de Gerenciar Produto
  const [isGlobalSettingsModalOpen, setIsGlobalSettingsModalOpen] = useState(false);

  // Adicione um novo estado para as configurações globais
  const [globalSettings, setGlobalSettings] = useState({
    defaultMinStock: null,
    daysBeforeExpiryNotification: null,
    notifyLowStock: null,
    notifyBeforeExpiry: null
  });

  const getStockColorClass = (stock) => {
  // Se as configurações ainda não foram carregadas ou notifyLowStock é null
  if (globalSettings.notifyLowStock === null || !globalSettings.defaultMinStock) {
    return 'text-gray-600';
  }

  if (!globalSettings.notifyLowStock) return 'text-gray-600';
  if (stock === 0) return 'text-red-600';
  if (stock <= globalSettings.defaultMinStock) return 'text-yellow-600';
  return 'text-green-600';
};

  const getValidityColorClass = (validateDate) => {
    if (!validateDate) return 'text-gray-600';
    
    // Se as configurações ainda não foram carregadas
    if (globalSettings.notifyBeforeExpiry === null || 
        !globalSettings.daysBeforeExpiryNotification) {
      return 'text-gray-600';
    }

    if (!globalSettings.notifyBeforeExpiry) return 'text-gray-600';

    const today = new Date();
    const expiryDate = new Date(validateDate + 'T00:00:00');
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'text-red-600';
    if (daysUntilExpiry <= globalSettings.daysBeforeExpiryNotification) return 'text-yellow-600';
    return 'text-green-600';
  };

  // 4. Certifique-se de que o useEffect está carregando as configurações quando o componente monta
  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  // 5. Adicione um handler para atualizar as configurações quando o modal fecha
  const handleCloseGlobalSettingsModal = () => {
    setIsGlobalSettingsModalOpen(false);
    fetchGlobalSettings(); // Recarrega as configurações após fechar o modal
  };

  // 2. CONFIGURAÇÃO DA API
  const api = axios.create({
    baseURL: "http://localhost:3333",
    withCredentials: true,
  });

  // Interceptors
  api.interceptors.response.use(
    (response) => {
      console.log("API Response Success:", response.config.url, response.data);
      return response;
    },
    (error) => {
      console.error("API Response Error:", error.config?.url, error);
      return Promise.reject(error);
    }
  );

  // Modifique a configuração do axios para incluir o token automaticamente
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config.url, config.params);
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // 3. FUNÇÕES AUXILIARES
  const calculateItemRange = () => {
    if (meta.total === 0) return { start: 0, end: 0 };
    const start = ((meta.currentPage - 1) * meta.perPage) + 1;
    const end = Math.min(meta.currentPage * meta.perPage, meta.total);
    return { start, end };
  };

  const shouldShowForm = () => {
    return editingProductId !== null || searchQuery.trim() === "";
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "";
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : "";
  };

  // Função para limpar o formulário
  const clearForm = () => {
    setNewProduct({ 
      name: '', 
      description: '', 
      price: '', 
      stock: '', 
      category_id: '', 
      validate_date: '' 
    });
    setSelectedCategoryId("");
    setEditingProductId(null);
  };

  // Função para formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Retorna string vazia se a data for inválida
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  // Função para formatar data para input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Retorna string vazia se a data for inválida
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  // 4. FUNÇÕES DE API
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
      console.log('Resposta das categorias:', response.data);

      // Verifica se a resposta tem dados
      if (response.data) {
        // Se a resposta for um objeto com propriedade data, use ela
        const categoriesData = response.data.data || response.data;
        
        // Verifica se categoriesData é um array
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
          setError('');
        } else {
          console.error('Formato inválido de categorias:', categoriesData);
          throw new Error('Formato de resposta inválido: categorias não é um array');
        }
      } else {
        throw new Error('Resposta vazia do servidor');
      }
    } catch (err) {
      console.error('Erro detalhado ao buscar categorias:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        localStorage.removeItem('token');
        // Adicione aqui sua lógica de redirecionamento para login
      } else {
        setError('Erro ao carregar categorias. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Primeiro, modifique a função fetchProducts
  const fetchProducts = async (pageNumber = 1, query = "") => {
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: { page: pageNumber, search: query }
      });
      
      const data = Array.isArray(response.data.data) 
        ? response.data.data.map(product => ({
            ...product,
            validate_date: product.validate_date || product.validateDate
          }))
        : [];
    
      const metaData = response.data.meta || {};
      
      setProducts([...data].sort((a, b) => b.id - a.id));
      setMeta({
        currentPage: Number(metaData.currentPage || pageNumber),
        lastPage: Number(metaData.lastPage || Math.ceil(data.length / 10)),
        total: Number(metaData.total || data.length),
        perPage: Number(metaData.perPage || 10),
        firstPage: Number(metaData.firstPage || 1)
      });
      
      setError("");
    } catch (err) {
      setError(err.response?.status === 401 
        ? "Você precisa estar logado para visualizar produtos."
        : "Erro ao carregar produtos. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar configurações globais
  const fetchGlobalSettings = async () => {
    try {
      const response = await api.get('/settings');
      console.log('Configurações carregadas do backend:', response.data);
      
      if (response.data) {
        setGlobalSettings({
          defaultMinStock: response.data.defaultMinStock,
          daysBeforeExpiryNotification: response.data.daysBeforeExpiryNotification,
          notifyLowStock: response.data.notifyLowStock,
          notifyBeforeExpiry: response.data.notifyBeforeExpiry
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações globais');
    }
  };

  // 5. HANDLERS
  const handleCategorySelect = (categoryId) => {
    if (!categoryId) return;
    
    const categoryIdNumber = parseInt(categoryId);
    const category = categories.find(cat => cat.id === categoryIdNumber);
    
    if (category) {
      console.log("Categoria selecionada:", category);
      setSelectedCategoryId(categoryId.toString());
      setNewProduct(prev => ({ ...prev, category_id: categoryId.toString() }));
      setIsChooseCategoryModalOpen(false);
    } else {
      console.error("Categoria não encontrada:", categoryId);
      setError('Categoria inválida selecionada');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedCategoryId) {
        setError('Por favor, selecione uma categoria para o produto.');
        return;
      }

      const productData = {
        name: newProduct.name,
        description: newProduct.description || null,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        category_id: Number(selectedCategoryId),
        validate_date: newProduct.validate_date // Mantenha o formato da data original
      };

      console.log('Dados a serem enviados:', productData);

      if (editingProductId) {
        const res = await api.put(`/products/${editingProductId}`, productData);
        console.log('Resposta da atualização:', res.data);
        
        // Atualiza o produto na lista mantendo o formato correto da data
        setProducts(products.map(p => {
          if (p.id === editingProductId) {
            return {
              ...res.data,
              validate_date: res.data.validateDate || res.data.validate_date
            };
          }
          return p;
        }));
        toast.success("Produto atualizado com sucesso!");
      } else {
        const res = await api.post('/products', productData);
        fetchProducts(1, searchQuery);
        toast.success("Produto adicionado com sucesso!");
      }

      clearForm();
      setError('');
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError(err.response?.data?.message || 'Erro ao salvar produto. Verifique os dados e tente novamente.');
    }
  };

  const handleEditProduct = (product) => {
    // Formatar a data corretamente considerando ambos os formatos possíveis
    let validateDate = '';
    if (product.validate_date) {
      validateDate = formatDateForInput(product.validate_date);
    } else if (product.validateDate) {
      validateDate = formatDateForInput(product.validateDate);
    }

    console.log('Data recebida:', product.validateDate || product.validate_date);
    console.log('Data formatada:', validateDate);

    setNewProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category_id: product.category_id?.toString() || product.categoryId?.toString() || '',
      validate_date: validateDate
    });
    
    setSelectedCategoryId(product.category_id?.toString() || product.categoryId?.toString() || '');
    setEditingProductId(product.id);
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    clearForm();
    console.log("Edição cancelada, estado limpo"); // Debug
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(product => product.id !== productId));
        toast.success('Produto excluído com sucesso!');
        
        // Se após excluir não houver mais produtos na página atual e não for a primeira página
        if (products.length === 1 && page > 1) {
          goToPage(page - 1);
        } else {
          // Recarregar a página atual para atualizar a paginação
          fetchProducts(page, searchQuery);
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        let errorMessage = 'Erro ao excluir produto.';
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Você precisa estar logado para excluir produtos.';
          } else if (err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
        setError(errorMessage);
      }
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > meta.lastPage) return;
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber.toString());
    setSearchParams(newParams);
  };

  // 6. EFFECTS
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Você precisa estar logado para acessar esta página');
      // Adicione aqui sua lógica de redirecionamento para login
      return;
    }
    fetchCategories();
  }, []);

  // Modifique o useEffect que observa searchParams
  useEffect(() => {
    const searchFromParams = searchParams.get("search") || "";
    const newPage = Number(searchParams.get("page") || "1");

    if (searchQuery !== searchFromParams) {
      setSearchQuery(searchFromParams);
    }

    fetchProducts(newPage, searchFromParams);
  }, [searchParams]);

  // Adicionar novo useEffect para carregar as configurações
  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-scroll mt-20 scrollbar-hide">
          <div className='border-b border-stone-400 px-36 mb-4 pb-4 sticky top-0 bg-white z-10'>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold mx-96 text-stone-700 py-6">
                Estoque de Produtos
              </h1>
            </div>
          </div>

          {/* Container do Form */}
          <div className="max-w-2xl mx-auto px-2">
            {/* Mensagens */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Barra de pesquisa com largura total do container */}
            <div className="mb-4 gap-2 flex items-center"> {/* Adicionado items-center */}
              <input
                type="text"
                placeholder="Pesquisar produto"
                value={searchQuery}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSearchQuery(newValue);
                  
                  // Atualiza os parâmetros da URL mantendo a consistência
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("search", newValue);
                  newParams.set("page", "1");
                  setSearchParams(newParams);
                }}
                className="p-3 rounded w-full text-lg placeholder-gray-400 text-white bg-cinza-escuro hover:bg-gray-800 focus:outline-none focus:bg-gray-800 transition-colors"
              />
              <button
                onClick={() => setIsGlobalSettingsModalOpen(true)}
                className="px-4 py-3 h-[52px] bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap focus:outline-none"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Gerenciar Produtos
              </button>
            </div>

            {/* Formulário */}
            {shouldShowForm() && (
              <div className="bg-white text-stone-600 py-6 pb-10 px-12 rounded-lg shadow-xl border border-stone-300 mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  {editingProductId ? "Editar Produto" : "Adicionar Novo Produto"}
                </h2>
                <form onSubmit={handleAddProduct}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Nome do Produto"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="p-3 rounded-lg col-span-2 text-lg text-gray-400 bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Descrição"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="p-3 rounded-lg col-span-2 text-lg text-gray-400 bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
                    />
                    <div className="col-span-2">
                      <h3 className="text-stone-600 font-semibold mb-2">Data de Validade</h3>
                      <input
                        type="date"
                        value={newProduct.validate_date || ''} // Garante que nunca será null
                        onChange={(e) => {
                          console.log('Nova data:', e.target.value); // Debug
                          setNewProduct(prev => ({
                            ...prev,
                            validate_date: e.target.value
                          }));
                        }}
                        className="p-3 rounded-lg w-full text-lg text-gray-400 bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Preço"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="p-3 rounded-lg text-lg text-gray-400 bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Estoque"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="p-3 rounded-lg text-lg text-gray-400 bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
                      required
                    />
                  </div>

                  {/* Categoria selecionada */}
                  {selectedCategoryId && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800">
                        <strong>Categoria selecionada:</strong> {getCategoryName(selectedCategoryId)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 flex-wrap">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:outline-none"
                    >
                      {editingProductId ? "Atualizar Produto" : "Adicionar Produto"}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setIsChooseCategoryModalOpen(true)}
                      className="px-4 py-2 bg-zinc-700 text-white rounded transition-colors hover:bg-zinc-500 duration-200 focus:outline-none">
                        {selectedCategoryId ? "Alterar Categoria" : "Escolher Categoria"}
                    </button>

                    {selectedCategoryId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategoryId("");
                          setNewProduct({ ...newProduct, category_id: "" });
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition focus:outline-none"
                      >
                        Remover Categoria
                      </button>
                    )}
                    {editingProductId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-8 ml-52 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition focus:outline-none"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Mensagem informativa quando o formulário está escondido */}
            {!shouldShowForm() && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                <p>💡 O formulário de adicionar produto está oculto durante a pesquisa. Clique em "Editar" em qualquer produto para editá-lo, ou limpe a pesquisa para adicionar novos produtos.</p>
              </div>
            )}

            {/* Lista de Produtos */}
            <div className="grid grid-cols-1 gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="bg-white p-6 rounded-lg hover:border-blue-300 shadow-lg hover:shadow-xl transition border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Cabeçalho com nome e categoria */}
                        <div className="flex items-center gap-4 mb-3">
                          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                          {(() => {
                            // Buscar categoria usando a mesma lógica do modal
                            const categoryId = product.category_id || product.categoryId;
                            const category = categoryId ? categories.find(cat => cat.id === parseInt(categoryId)) : null;
                            
                            return category ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {category.name}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Sem categoria
                              </span>
                            );
                          })()}
                        </div>
                        
                        {/* Descrição */}
                        <p className="text-gray-600 mb-4 text-lg">{product.description}</p>
                        
                        {/* Informações do produto em grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 font-medium">Preço:</span>
                            <span className="text-green-600 font-bold ml-1">R$ {Number(product.price).toFixed(2)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 font-medium">Estoque:</span>
                            <span className={`font-bold ml-1 ${getStockColorClass(product.stock)}`}>
                              {product.stock} unidades
                            </span>
                          </div>
                        </div>

                        {/* Data de Validade */}
                        {product.validate_date && (
                          <div className="flex items-center col-span-2">
                            <svg 
                              className="w-5 h-5 mr-2 text-purple-600" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                              />
                            </svg>
                            <span className="text-gray-700 font-medium">Validade:</span>
                            <span className={`font-bold ml-1 ${getValidityColorClass(product.validate_date)}`}>
                              {new Date(product.validate_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                              {new Date(product.validate_date + 'T00:00:00') < new Date() && " (Vencido)"}
                            </span>
                          </div>
                        )}

                        {/* Indicador de estoque baixo */}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="flex items-center p-2 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                            <svg className="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-yellow-800 text-sm font-medium">Estoque baixo!</span>
                          </div>
                        )}

                        {/* Produto sem estoque */}
                        {product.stock === 0 && (
                          <div className="flex items-center p-2 bg-red-50 border border-red-200 rounded-lg mb-3">
                            <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-800 text-sm font-medium">Produto fora de estoque</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition focus:outline-none flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition focus:outline-none flex items-center gap-2"
                        >
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-10">
                  <p className="mb-4">Nenhum produto encontrado.</p>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page <= 1}
                      className={`px-4 py-2 rounded focus:outline-none ${
                        page <= 1
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Voltar
                    </button>

                    <button
                      onClick={() => fetchProducts(page, searchQuery)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
                    >
                      Recarregar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Paginação */}
            <div className="mt-6 mb-8">
              {console.log("Estado atual do meta:", meta)} {/* Debug */}
              {meta.lastPage > 1 && (
                <div className="flex flex-col items-center gap-4">
                  {/* Botões de navegação */}
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => goToPage(meta.currentPage - 1)}
                      disabled={meta.currentPage <= 1}
                      className={`px-4 py-2 rounded focus:outline-none transition-colors ${
                        meta.currentPage <= 1
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Anterior
                    </button>

                    {/* Paginação inteligente - mostra no máximo 5 páginas */}
                    {(() => {
                      const pages = [];
                      const maxVisiblePages = 5;
                      let startPage = Math.max(1, meta.currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(meta.lastPage, startPage + maxVisiblePages - 1);
                      
                      // Ajusta o startPage se necessário
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => goToPage(i)}
                            className={`px-4 py-2 rounded focus:outline-none transition-colors ${
                              i === meta.currentPage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pages;
                    })()}

                    <button
                      onClick={() => goToPage(meta.currentPage + 1)}
                      disabled={meta.currentPage >= meta.lastPage}
                      className={`px-4 py-2 rounded focus:outline-none transition-colors ${
                        meta.currentPage >= meta.lastPage
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Próximo
                    </button>
                  </div>

                  {/* Informações da paginação */}
                  <div className="text-center text-sm text-stone-600">
                    {(() => {
                      const { start, end } = calculateItemRange();
                      const hasSearch = searchQuery.trim() !== "";
                      
                      if (meta.total === 0) {
                        return hasSearch 
                          ? `Nenhum resultado encontrado para "${searchQuery}"` 
                          : "Nenhum produto cadastrado";
                      }
                      
                      return (
                        <>
                          <div>
                            Página {meta.currentPage} de {meta.lastPage}
                          </div>
                          <div>
                            Mostrando {start} - {end} de {meta.total} {meta.total === 1 ? 'produto' : 'produtos'}
                            {hasSearch && ` para "${searchQuery}"`}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
              
              {/* Caso tenha produtos mas apenas 1 página */}
              {meta.lastPage === 1 && meta.total > 0 && (
                <div className="text-center text-sm text-stone-600 mt-4">
                  {(() => {
                    const hasSearch = searchQuery.trim() !== "";
                    return (
                      <>
                        <div>
                          Mostrando {meta.total === 1 ? '1 produto' : `todos os ${meta.total} produtos`}
                          {hasSearch && ` para "${searchQuery}"`}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
      {/* Modal de escolher categoria */}
      <ChooseCategoryModal
        isOpen={isChooseCategoryModalOpen}
        onClose={() => setIsChooseCategoryModalOpen(false)}
        onCategorySelect={handleCategorySelect}
        selectedCategoryId={selectedCategoryId}
      />

      {/* Modal de configurações globais */}
      <GlobalSettingsModal 
        isOpen={isGlobalSettingsModalOpen}
        onClose={handleCloseGlobalSettingsModal}
      />

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-700">Carregando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estoque;