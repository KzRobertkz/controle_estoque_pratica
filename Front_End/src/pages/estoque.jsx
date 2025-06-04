// React e hooks
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Bibliotecas externas
import axios from 'axios';

// Componentes
import Header from "../components/Header/header";
import { Sidebar } from "../components/Sidebar/sidebar";
import { ChooseCategoryModal } from "../components/modal/choosecategorymodal";

function Estoque() {
  // 1. ESTADOS
  // Estados de UI
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estados de Produtos
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: ""
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

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config.url, config.params);
    return config;
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

  // 4. FUNÇÕES DE API
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async (pageNumber = 1, query = "") => {
    try {
      const response = await api.get("/products", {
        params: { page: pageNumber, search: query }
      });
      
      const data = Array.isArray(response.data.data) ? response.data.data : [];
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
    }
  };

  // 5. HANDLERS
  const handleCategorySelect = (categoryId) => {
    const categoryIdString = categoryId.toString();
    setSelectedCategoryId(categoryIdString);
    setNewProduct(prev => ({ ...prev, category_id: categoryIdString }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Debug: Verificar os dados antes de enviar
    console.log("Dados do produto antes de enviar:", {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      stock: newProduct.stock,
      category_id: newProduct.category_id,
      selectedCategoryId: selectedCategoryId
    });
    
    try {
      // CORREÇÃO IMPORTANTE: Priorizar selectedCategoryId sobre newProduct.category_id
      const categoryIdToUse = selectedCategoryId || newProduct.category_id;
      
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        category_id: categoryIdToUse ? Number(categoryIdToUse) : null
      };

      // Debug: Verificar os dados finais que serão enviados
      console.log("Dados finais sendo enviados para a API:", productData);

      if (editingProductId) {
        const res = await api.put(`/products/${editingProductId}`, productData);
        console.log("Resposta da API ao atualizar produto:", res.data);
        setProducts(products.map(p => (p.id === editingProductId ? res.data : p)));
        setSuccessMessage("Produto atualizado com sucesso!");
      } else {
        const res = await api.post('/products', productData);
        console.log("Resposta da API ao criar produto:", res.data);
        
        // Recarregar a primeira página após adicionar um produto
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", "1");
        setSearchParams(newParams);
        fetchProducts(1, searchQuery); // Forçar atualização da página 1
        setSuccessMessage("Produto adicionado com sucesso!");
      }

      // Limpar formulário
      setNewProduct({ name: '', description: '', price: '', stock: '', category_id: '' });
      setSelectedCategoryId("");
      setEditingProductId(null);
      setTimeout(() => setSuccessMessage(''), 3000);
      setError('');
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      console.error("Resposta do erro:", err.response?.data);
      setError('Erro ao salvar produto. Verifique os dados e tente novamente.');
    }
  };

  const handleEditProduct = (product) => {
  console.log("Editando produto:", product); // Debug
    
    // CORREÇÃO: Buscar o category_id da estrutura correta
    // O produto pode ter: product.categoryId, product.category_id, ou product.category.id
    let categoryId = "";
    
    if (product.categoryId) {
      categoryId = product.categoryId.toString();
    } else if (product.category_id) {
      categoryId = product.category_id.toString();
    } else if (product.category && product.category.id) {
      categoryId = product.category.id.toString();
    }
    
    console.log("Categoria do produto:", {
      original_categoryId: product.categoryId,
      original_category_id: product.category_id,
      original_category: product.category,
      converted_categoryId: categoryId,
      categoryName: getCategoryName(categoryId)
    }); // Debug detalhado
    
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: categoryId
    });
    
    // Definir selectedCategoryId
    setSelectedCategoryId(categoryId);
    
    console.log("Estados sendo definidos:", {
      selectedCategoryId: categoryId,
      newProduct_category_id: categoryId,
      editingProductId: product.id
    }); // Debug
    
    setEditingProductId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setNewProduct({ name: '', description: '', price: '', stock: '', category_id: '' });
    setSelectedCategoryId("");
    setEditingProductId(null);
    console.log("Edição cancelada, estado limpo"); // Debug
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(product => product.id !== productId));
        setSuccessMessage('Produto excluído com sucesso!');
        
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
    fetchCategories();
  }, []);

  useEffect(() => {
    const searchFromParams = searchParams.get("search") || "";
    const newPage = Number(searchParams.get("page") || "1");

    if (searchQuery !== searchFromParams) {
      setSearchQuery(searchFromParams);
    }

    fetchProducts(newPage, searchFromParams);
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-scroll mt-20 scrollbar-hide">
          <div className='border-b border-stone-400 px-32 mb-4 pb-4 sticky top-0 bg-white z-10'>
            <h1 className="text-2xl flex justify-center font-semibold text-stone-700 py-6 px-96 ">
              Estoque de Produtos
            </h1>
          </div>

          {/* Container do Form */}
          <div className="max-w-xl mx-auto px-2"> {/* Reduz a largura máxima e adiciona padding */}
            {/* Mensagens */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            {/* Barra de pesquisa com largura total do container */}
            <div className="mb-4">
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
                  newParams.set("page", "1"); // Reset to page 1 on search change
                  setSearchParams(newParams);
                }}
                className="p-3 mt-6 rounded w-full text-lg placeholder-gray-400 text-white bg-cinza-escuro hover:bg-gray-800 focus:outline-none focus:bg-gray-800 transition-colors"
              />
            </div>

            {/* Formulário */}
            {shouldShowForm() && (
              <div className="bg-white text-stone-600 p-6 rounded-lg shadow-xl border border-stone-300 mb-8"> {/* Padding do form */}
                <h2 className="text-2xl font-semibold mb-4"> {/* Margem inferior */}
                  {editingProductId ? "Editar Produto" : "Adicionar Novo Produto"}
                </h2>
                <form onSubmit={handleAddProduct}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Nome do Produto"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="p-3 rounded-lg col-span-2 text-lg text-white bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Descrição"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="p-3 rounded-lg col-span-2 text-lg text-white bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Preço"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="p-3 rounded-lg text-lg text-white bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Estoque"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="p-3 rounded-lg text-lg text-white bg-cinza-escuro hover:bg-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-800 transition-colors"
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
                        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition focus:outline-none"
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
                            <span className={`font-bold ml-1 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {product.stock} unidades
                            </span>
                          </div>
                        </div>

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
      
      {/* Modal de escolher categoria */}
      <ChooseCategoryModal
        isOpen={isChooseCategoryModalOpen}
        onClose={() => setIsChooseCategoryModalOpen(false)}
        categories={categories}
        onCategorySelect={handleCategorySelect}
        selectedCategoryId={selectedCategoryId}
      />
    </div>
  );
}

export default Estoque;