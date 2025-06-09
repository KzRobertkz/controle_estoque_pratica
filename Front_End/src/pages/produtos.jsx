// React e hooks
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// Bibliotecas externas
import axios from 'axios';
import { ToastContainer, toast, Slide} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ícones
import { MdOutlineInventory2 } from "react-icons/md";
import { FaFilter } from "react-icons/fa";

// Componentes de layout
import Header from "../components/Header/header";
import { Sidebar } from "../components/Sidebar/sidebar";

// Componentes de modal
import { EditModal } from '../components/modal/editmodal';
import { DetailsModal } from '../components/modal/detailsmodal';
import { CreateCategoryModal } from '../components/modal/newcategorymodal';
import { ManageCategorysModal } from '../components/modal/categorysmodal';
import { FilterModal } from '../components/modal/filtermodal';
import { GlobalSettingsModal } from '../components/modal/globalsettingsmodal';
import { shouldShowNotifications } from '../utils/notificationUtils';

export const Produtos = () => {
  // 1. ESTADOS
  // Estados de UI e Controle
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [notificationsShown, setNotificationsShown] = useState(false);
  const [globalSettingsborder, setGlobalSettingsborder] = useState(null);

  // Estados de Produtos
  const [allProdutos, setAllProdutos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  

  // Estados de Modais - Nomenclatura padronizada
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isManageCategorysModalOpen, setIsManageCategorysModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isGlobalSettingsModalOpen, setIsGlobalSettingsModalOpen] = useState(false);

  // Estados de Categoria
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // Estados de Filtros
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    id: ''
  });

  // Constantes
  const itemsPerPage = 20;

  // 2. CONFIGURAÇÃO DA API
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

  // 3. FUNÇÕES AUXILIARES
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(preco));
  };

  const calculateItemRange = () => {
    if (meta.total === 0) return { start: 0, end: 0 };
    
    const start = ((meta.currentPage - 1) * meta.perPage) + 1;
    const end = Math.min(meta.currentPage * meta.perPage, meta.total);
    
    return { start, end };
  };

  const getCategoryName = (produto) => {
    if (produto.category && typeof produto.category === 'string') {
      return produto.category;
    }

    if (produto.category?.name) {
      return produto.category.name;
    }

    const categoryId = produto.category_id || produto.categoryId;
    if (!categoryId) return 'Sem categoria';

    const category = categories.find(cat => cat?.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const getCategoryId = (produto) => {
    // Se a categoria é um objeto, pegar o ID dele
    if (produto.category && typeof produto.category === 'object' && produto.category.id) {
      return produto.category.id;
    }

    // Tentar pegar o ID da categoria de diferentes propriedades
    return produto.category_id || produto.categoryId || null;
  };

  const handleCloseGlobalSettingsModal = () => {
    setIsGlobalSettingsModalOpen(false);
  };

  // 4. FUNÇÕES DE DADOS
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      const categoriesData = response.data.data || response.data || [];
      setCategories(categoriesData);
      console.log('Categorias carregadas:', categoriesData);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setCategories([]);
    }
  };

  const fetchAllProdutos = async () => {
    try {
      setIsLoading(true);
      
      let allData = [];
      let currentPage = 1;
      let hasMoreData = true;
      
      while (hasMoreData) {
        const response = await api.get("/products", {
          params: { 
            page: currentPage,
            per_page: 100
          }
        });
        
        // Mapeia os dados e certifica que validate_date esteja definido a partir de validateDate
        const pageData = Array.isArray(response.data.data) 
          ? response.data.data.map(product => ({
              ...product,
              validate_date: product.validateDate // Usa validateDate da API
            }))
          : [];

        allData = [...allData, ...pageData];
        
        const meta = response.data.meta;
        if (meta && meta.currentPage < meta.lastPage) {
          currentPage++;
        } else {
          hasMoreData = false;
        }
      }
      
      const sortedData = [...allData].sort((a, b) => b.id - a.id);
      
      console.log('Exemplo de produto processado:', sortedData[0]); // Debug log
      setAllProdutos(sortedData);
      setError("");
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError(error.response?.status === 401 
        ? "Você precisa estar logado para visualizar produtos."
        : "Erro ao carregar produtos. Por favor, tente novamente."
      );
      setAllProdutos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Nova função para buscar configurações globais e definir a borda
  const fetchGlobalSettings = async () => {
    try {
        const response = await api.get('/settings');
        setGlobalSettingsborder(response.data);
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
  };

  const applyFiltersToProducts = (products, appliedFilters) => {
    return products.filter(produto => {
      // Filtro por ID
      if (appliedFilters.id && !produto.id.toString().includes(appliedFilters.id)) {
        return false;
      }
      
      // Filtro por categoria (melhorado)
      if (appliedFilters.category) {
        const filterCategoryId = parseInt(appliedFilters.category);
        const produtoCategoryId = getCategoryId(produto);
        
        if (!produtoCategoryId || produtoCategoryId !== filterCategoryId) {
          return false;
        }
      }
      
      // Filtro por preço mínimo
      if (appliedFilters.minPrice && parseFloat(produto.price) < parseFloat(appliedFilters.minPrice)) {
        return false;
      }
      
      // Filtro por preço máximo
      if (appliedFilters.maxPrice && parseFloat(produto.price) > parseFloat(appliedFilters.maxPrice)) {
        return false;
      }
      
      // Filtro por estoque mínimo
      if (appliedFilters.minStock && parseInt(produto.stock) < parseInt(appliedFilters.minStock)) {
        return false;
      }
      
      // Filtro por estoque máximo
      if (appliedFilters.maxStock && parseInt(produto.stock) > parseInt(appliedFilters.maxStock)) {
        return false;
      }
      
      return true;
    });
  };

  const validateNotify = async () => {
    // Verifica primeiro se as notificações devem ser mostradas
    if (!shouldShowNotifications()) return;

    try {
        const response = await api.get('/settings');
        const settings = response.data;
        
        if (!settings.notifyBeforeExpiry) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const productsNearExpiry = allProdutos.filter(product => {
            const expiryDate = product.validate_date || product.validateDate;
            if (!expiryDate) return false;

            const validityDate = new Date(expiryDate);
            validityDate.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((validityDate - today) / (1000 * 60 * 60 * 24));

            return diffDays > 0 && diffDays <= settings.daysBeforeExpiryNotification;
        });

        productsNearExpiry.forEach(product => {
            const validityDate = new Date(product.validate_date);
            validityDate.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((validityDate - today) / (1000 * 60 * 60 * 24));
            toast.warning(`Vence em ${diffDays} dias: código #${product.id} - ${product.name}`);
        });
    } catch (error) {
        console.error('Erro ao verificar produtos a vencer:', error);
      }
  };

  const lowStockNotify = async () => {
      // Verifica primeiro se as notificações devem ser mostradas
      if (!shouldShowNotifications()) return;

      try {
          const response = await api.get('/settings');
          const settings = response.data;
          
          if (!settings.notifyLowStock) return;

          const lowStockProducts = allProdutos.filter(product => 
              product.stock <= settings.defaultMinStock && product.stock > 0
          );

          lowStockProducts.forEach(product => {
              toast.warn(`Baixo estoque: código #${product.id} - ${product.name}`);
          });
      } catch (error) {
          console.error('Erro ao verificar produtos com baixo estoque:', error);
      }
  };

  // Nova função para executar as notificações automaticamente
  const showNotifications = async () => {
    if (notificationsShown || allProdutos.length === 0) return;
    
    try {
      await validateNotify();
      await lowStockNotify();
      setNotificationsShown(true);
    } catch (error) {
      console.error('Erro ao mostrar notificações:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    if (!shouldShowNotifications()) return;
    
    switch(type) {
        case 'success':
            toast.success(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
        case 'error':
            toast.error(message);
            break;
        default:
            toast(message);
      }
  };

  // 5. HANDLERS
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    setIsSubmittingCategory(true);
    setError(''); // Limpar erros anteriores
    
    try {
      const categoryData = {
        name: categoryName.trim(),
        description: categoryDescription.trim() || null
      };

      console.log('Enviando dados da categoria:', categoryData);

      const response = await api.post("/categories", categoryData);
      const newCategory = response.data.data || response.data;
      setCategories(prev => [...prev, newCategory]);
      setIsCreateCategoryModalOpen(false);
      setCategoryName('');
      setCategoryDescription('');
      toast.success('Categoria criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      
      let errorMessage = 'Erro ao criar categoria.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Você precisa estar logado para criar categorias.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Dados inválidos fornecidos.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleEdit = (produto) => {
    setEditingProduct(produto);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Preparar os dados para envio, garantindo que category_id seja enviado
      const productData = {
        ...editingProduct,
        category_id: editingProduct.category_id || editingProduct.categoryId,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock)
      };

      const response = await api.put(`/products/${editingProduct.id}`, productData);
      setAllProdutos(prevProdutos => 
        prevProdutos.map(p => 
          p.id === editingProduct.id ? response.data : p
        )
      );
      setIsEditModalOpen(false);
      setEditingProduct(null);
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setError('Erro ao atualizar produto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${id}`);
        setAllProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
        toast.success('Produto excluído com sucesso!');
        
        // Mantenha a lógica de paginação existente
        const remainingProducts = filteredProdutos.filter(produto => produto.id !== id);
        const maxPage = Math.ceil(remainingProducts.length / itemsPerPage) || 1;
        if (currentPage > maxPage) {
          setCurrentPage(maxPage);
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        let errorMessage = 'Erro ao excluir produto.';
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Você precisa estar logado para excluir produtos.';
          } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        setError(errorMessage);
      }
    }
  };

  const handleShowDetails = (produto) => {
    setSelectedProduct(produto);
    setIsDetailsModalOpen(true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
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
    setFilters(emptyFilters);
  };

  // 6. FUNÇÕES DE NAVEGAÇÃO
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > meta.lastPage) return;
    setCurrentPage(pageNumber);
    
    // Atualizar URL sem causar reload
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber.toString());
    if (searchQuery.trim()) {
      newParams.set("search", searchQuery);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams, { replace: true });
  };

  // 7. MEMOS E COMPUTAÇÕES
  const filteredProdutos = useMemo(() => {
    let filtered = allProdutos;

    // Aplicar busca por texto (melhorado)
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(produto => {
        const name = produto.name ? produto.name.toLowerCase() : '';
        const id = produto.id ? produto.id.toString() : '';
        const categoryName = getCategoryName(produto).toLowerCase();
        
        return name.includes(searchTerm) || 
          id.includes(searchTerm) || 
          categoryName.includes(searchTerm);
      });
    }

    // Aplicar filtros
    filtered = applyFiltersToProducts(filtered, filters);

    return filtered;
  }, [allProdutos, searchQuery, filters, categories]);

  const paginatedProdutos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProdutos.slice(startIndex, endIndex);
  }, [filteredProdutos, currentPage, itemsPerPage]);

  const meta = useMemo(() => {
    const total = filteredProdutos.length;
    const lastPage = Math.ceil(total / itemsPerPage) || 1;
    
    return {
      currentPage,
      lastPage,
      total,
      perPage: itemsPerPage,
      firstPage: 1
    };
  }, [filteredProdutos.length, currentPage, itemsPerPage]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // 8. EFFECTS
  useEffect(() => {
    const loadData = async () => {
      try {
        // Primeiro carrega as categorias e os produtos, depois as configurações globais
        await fetchCategories();
        await fetchAllProdutos();
        await fetchGlobalSettings(); // Add this line
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    loadData();
    
    // Recuperar estado da URL
    const searchFromParams = searchParams.get("search") || "";
    const pageFromParams = Number(searchParams.get("page") || "1");
    
    setSearchQuery(searchFromParams);
    setCurrentPage(pageFromParams);
  }, []);

  // Effect separado para mostrar notificações quando os produtos estiverem carregados
  useEffect(() => {
    if (!isLoading && allProdutos.length > 0 && !notificationsShown) {
      // Delay pequeno para garantir que a página foi totalmente carregada
      const timeoutId = setTimeout(() => {
        showNotifications();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, allProdutos.length, notificationsShown]);

  // Quando a busca ou filtros mudam, resetar para página 1
  useEffect(() => {
    setCurrentPage(1);
  
    // Atualizar URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    if (searchQuery.trim()) {
      newParams.set("search", searchQuery);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams, { replace: true });
  }, [searchQuery, filters]);

  // Scroll para o topo quando mudar de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const getValidityColorClass = (validateDate) => {
    if (!validateDate) return '';
    
    const today = new Date();
    const expiryDate = new Date(validateDate + 'T00:00:00');
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    const settings = globalSettings; // Configurações do banco de dados
    
    if (daysUntilExpiry < 0) return 'text-red-600'; // Vencido
    if (daysUntilExpiry <= settings.daysBeforeExpiryNotification) return 'text-yellow-600'; // Próximo do vencimento
    return 'text-green-600'; // Normal
  };

  const getProductWarningStatus = (product) => {
      if (!globalSettingsborder) return false;
      
      // Checa por estoque baixo
      if (globalSettingsborder.notifyLowStock && 
          product.stock <= globalSettingsborder.defaultMinStock && 
          product.stock > 0) {
          return true;
      }

      // Checa por produtos vencendo
      if (globalSettingsborder.notifyBeforeExpiry && product.validate_date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const validityDate = new Date(product.validate_date);
          validityDate.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((validityDate - today) / (1000 * 60 * 60 * 24));
          
          if (diffDays > 0 && diffDays <= globalSettingsborder.daysBeforeExpiryNotification) {
              return true;
          }
      }

      return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
          <Sidebar />
          <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-auto mt-20 scrollbar-hide flex items-center justify-center">
            <p className="text-lg text-stone-600">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-auto mt-20 scrollbar-hide">
          <div className='border-b border-stone-400 px-4 mb-4 pb-4 sticky top-0 bg-white z-10'>
            <div className='flex items-center justify-between p-0.5'>
              <div>
                <h3 className='flex items-center gap-3 py-6 font-semibold text-xl text-stone-700'>
                  <MdOutlineInventory2 className="text-stone-500 text-3xl" />
                  Produtos
                </h3>
              </div>

              <div className='flex items-center gap-4 ml-96 pl-10'>
                <div className='text-sm text-stone-500'>
                  Total: {allProdutos.length} produtos
                  {hasActiveFilters && ` | Filtrados: ${filteredProdutos.length}`}
                </div>
                <button 
                  onClick={() => setIsGlobalSettingsModalOpen(true)}
                  className="px-4 py-2 bg-zinc-700 text-white rounded transition-colors hover:bg-zinc-500 duration-200 focus:outline-none"
                >
                  Gerenciar Produtos
                </button>
                <button 
                  onClick={() => setIsCreateCategoryModalOpen(true)}
                  className="px-4 py-2 bg-zinc-700 text-white rounded transition-colors hover:bg-zinc-500 duration-200 focus:outline-none"
                >
                  Nova Categoria
                </button>
                <button 
                  onClick={() => setIsManageCategorysModalOpen(true)}
                  className="px-4 py-2 bg-zinc-700 text-white rounded transition-colors hover:bg-zinc-500 duration-200 focus:outline-none"
                >
                  Categorias
                </button>
                <button 
                  onClick={() => setIsFilterModalOpen(true)}
                  className={`flex gap-2 px-4 py-2 rounded transition-colors duration-200 focus:outline-none ${
                    hasActiveFilters 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-zinc-700 text-white hover:bg-zinc-500'
                  }`}
                >
                  Filtrar
                  <FaFilter className='text-base mt-1'/>
                  {hasActiveFilters && <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold">!</span>}
                </button>
              </div>
            </div>
          </div>

          <div className='px-6'>
            {/* Mensagens de erro e sucesso */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
                <button 
                  onClick={() => setError('')}
                  className="float-right text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Barra de pesquisa - filtro em tempo real */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Pesquisar produto por nome, código ou categoria..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {(searchQuery || hasActiveFilters) && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-stone-500">
                    Mostrando {filteredProdutos.length} resultado{filteredProdutos.length !== 1 ? 's' : ''}
                    {searchQuery && ` para "${searchQuery}"`}
                    {hasActiveFilters && " (com filtros aplicados)"}
                  </p>
                  {(searchQuery || hasActiveFilters) && (
                    <div className="flex gap-2">
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 focus:outline-none"
                        >
                          Limpar Busca
                        </button>
                      )}
                      {hasActiveFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="px-3 py-1 bg-blue-200 text-blue-700 text-sm rounded hover:bg-blue-300 focus:outline-none"
                        >
                          Limpar Filtros
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Grid de produtos */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {paginatedProdutos.length > 0 ? (
                paginatedProdutos.map((produto) => (
                  <div 
                    key={produto.id}
                    className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 
                    ${getProductWarningStatus(produto) 
                        ? 'border-2 border-yellow-400' 
                        : 'border border-stone-300'}`}
                  >
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-semibold text-stone-700">{produto.name}</h4>
                      <p className="text-stone-600">Código: #{produto.id}</p>
                      <p className="text-stone-600">Quantidade: {produto.stock}</p>
                      <p className="text-stone-600">
                        Categoria: <span className="font-medium text-blue-600">{getCategoryName(produto)}</span>
                      </p>
                      <p className="text-lg font-medium text-stone-700">{formatarPreco(produto.price)}</p>
                      <div className="mt-4 flex justify-end gap-2">
                        <button 
                          onClick={() => handleShowDetails(produto)}
                          className="px-3 py-1 bg-stone-400 text-white text-sm rounded-md hover:bg-stone-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        >
                          Detalhes
                        </button>
                        <button 
                          onClick={() => handleEdit(produto)}
                          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(produto.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-lg text-stone-500 mb-4">
                    {searchQuery.trim() !== "" || hasActiveFilters
                      ? "Nenhum produto encontrado com os critérios especificados" 
                      : "Nenhum produto encontrado"
                    }
                  </p>
                  
                  {(searchQuery.trim() !== "" || hasActiveFilters) && (
                    <div className="flex gap-2">
                      {searchQuery.trim() !== "" && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                        >
                          Limpar Busca
                        </button>
                      )}
                      {hasActiveFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
                        >
                          Limpar Filtros
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Paginação */}
            <div className="mt-8">
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
                      const hasFilters = searchQuery.trim() !== "" || hasActiveFilters;
                      
                      if (meta.total === 0) {
                        return hasFilters 
                          ? "Nenhum resultado encontrado com os critérios especificados" 
                          : "Nenhum produto cadastrado";
                      }
                      
                      return (
                        <>
                          <div>
                            Página {meta.currentPage} de {meta.lastPage}
                          </div>
                          <div>
                            Mostrando {start} - {end} de {meta.total} {meta.total === 1 ? 'produto' : 'produtos'}
                            {hasFilters && ` encontrado${meta.total !== 1 ? 's' : ''}`}
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
                    const hasFilters = searchQuery.trim() !== "" || hasActiveFilters;
                    return (
                      <div>
                        Mostrando {meta.total === 1 ? '1 produto' : `todos os ${meta.total} produtos`}
                        {hasFilters && ` encontrado${meta.total !== 1 ? 's' : ''}`}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
        toastClassName="!w-96" // aumenta a largura
        />
      {/* Modais existentes */}
      <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        produto={editingProduct}
        onSave={handleUpdate}
        onChange={setEditingProduct}
        categories={categories}
        getCategoryId={getCategoryId}
      />
      
      <DetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProduct(null);
        }}
        produto={selectedProduct}
        getCategoryName={getCategoryName}
      />

      {/* Modal para criar categoria */}
      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryDescription={categoryDescription}
        setCategoryDescription={setCategoryDescription}
        onSubmit={handleCreateCategory}
        isSubmitting={isSubmittingCategory}
      />

      <ManageCategorysModal
        isOpen={isManageCategorysModalOpen}
        onClose={() => setIsManageCategorysModalOpen(false)}
        onCategoryChange={() => {
          fetchCategories(); // Recarrega as categorias quando houver mudanças
        }}
      />

      {/* Modal de filtros */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Modal de gerenciamento de produtos */}
      <GlobalSettingsModal 
        isOpen={isGlobalSettingsModalOpen} // Corrigido de isGlobalSettingModalOpen
        onClose={handleCloseGlobalSettingsModal}
      />
    </div>
  );
};