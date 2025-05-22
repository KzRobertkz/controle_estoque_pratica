import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import Header from "../components/Header/header"
import { Sidebar } from "../components/Sidebar/sidebar"
import { MdOutlineInventory2 } from "react-icons/md"
import { EditModal } from '../components/modal/editmodal';
import { DetailsModal } from '../components/modal/detailsmodal';

export const Produtos = () => {
  const [allProdutos, setAllProdutos] = useState([]); // Todos os produtos carregados
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 20;

  // API instance
  const api = axios.create({
    baseURL: "http://localhost:3333",
    withCredentials: true,
  });

  // Interceptor para adicionar token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Filtrar produtos baseado na busca
  const filteredProdutos = useMemo(() => {
    if (!searchQuery.trim()) {
      return allProdutos;
    }

    return allProdutos.filter(produto => 
      produto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      produto.id.toString().includes(searchQuery) ||
      (produto.category && produto.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allProdutos, searchQuery]);

  // Calcular produtos da página atual
  const paginatedProdutos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProdutos.slice(startIndex, endIndex);
  }, [filteredProdutos, currentPage, itemsPerPage]);

  // Calcular meta dados da paginação
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

  // Função para calcular o range dos itens mostrados
  const calculateItemRange = () => {
    if (meta.total === 0) return { start: 0, end: 0 };
    
    const start = ((meta.currentPage - 1) * meta.perPage) + 1;
    const end = Math.min(meta.currentPage * meta.perPage, meta.total);
    
    return { start, end };
  };

  // Função para buscar TODOS os produtos de uma vez
  const fetchAllProdutos = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando todos os produtos...');
      
      // Fazer múltiplas requisições se necessário para pegar todos os produtos
      let allData = [];
      let currentPage = 1;
      let hasMoreData = true;
      
      while (hasMoreData) {
        const response = await api.get("/products", {
          params: { 
            page: currentPage,
            per_page: 100 // Pegar 100 por vez para ser mais eficiente
          }
        });
        
        const pageData = Array.isArray(response.data.data) ? response.data.data : [];
        allData = [...allData, ...pageData];
        
        // Verificar se há mais páginas
        const meta = response.data.meta;
        if (meta && meta.currentPage < meta.lastPage) {
          currentPage++;
        } else {
          hasMoreData = false;
        }
      }
      
      // Ordena os produtos por ID em ordem decrescente
      const sortedData = [...allData].sort((a, b) => b.id - a.id);
      
      setAllProdutos(sortedData);
      setError("");
      console.log(`Total de produtos carregados: ${sortedData.length}`);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      if (error.response && error.response.status === 401) {
        setError("Você precisa estar logado para visualizar produtos.");
      } else {
        setError("Erro ao carregar produtos. Por favor, tente novamente.");
      }
      setAllProdutos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para navegar entre páginas
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

  // Inicialização - carrega todos os produtos uma única vez
  useEffect(() => {
    fetchAllProdutos();
    
    // Recuperar estado da URL
    const searchFromParams = searchParams.get("search") || "";
    const pageFromParams = Number(searchParams.get("page") || "1");
    
    setSearchQuery(searchFromParams);
    setCurrentPage(pageFromParams);
  }, []);

  // Quando a busca muda, resetar para página 1
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
  }, [searchQuery]);

  // Scroll para o topo quando mudar de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(preco));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${id}`);
        
        // Remover produto da lista local
        setAllProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
        setSuccessMessage('Produto excluído com sucesso!');
        
        // Se a página atual ficar vazia após a exclusão, voltar uma página
        const remainingProducts = filteredProdutos.filter(produto => produto.id !== id);
        const maxPage = Math.ceil(remainingProducts.length / itemsPerPage) || 1;
        if (currentPage > maxPage) {
          setCurrentPage(maxPage);
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
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

  const handleEdit = (produto) => {
    setEditingProduct(produto);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/products/${editingProduct.id}`, editingProduct);
      
      // Atualizar produto na lista local
      setAllProdutos(prevProdutos => 
        prevProdutos.map(p => 
          p.id === editingProduct.id ? response.data : p
        )
      );
      
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setSuccessMessage('Produto atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setError('Erro ao atualizar produto');
    }
  };

  const handleShowDetails = (produto) => {
    setSelectedProduct(produto);
    setIsDetailsModalOpen(true);
  };

  // Função para lidar com mudanças no input de pesquisa
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

              <div className='flex items-center gap-4'>
                <div className='text-sm text-stone-500'>
                  Total: {allProdutos.length} produtos
                </div>
                <button className="px-4 py-2 bg-zinc-700 text-white rounded transition-colors hover:bg-zinc-500 duration-200 focus:outline-none">
                  Nova Categoria
                </button>
              </div>
            </div>
          </div>

          <div className='px-6'>
            {/* Mensagens de erro e sucesso */}
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

            {/* Barra de pesquisa - filtro em tempo real */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Pesquisar produto por nome, código ou categoria..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <p className="text-sm text-stone-500 mt-2">
                  Mostrando {filteredProdutos.length} resultado{filteredProdutos.length !== 1 ? 's' : ''} para "{searchQuery}"
                </p>
              )}
            </div>

            {/* Grid de produtos */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {paginatedProdutos.length > 0 ? (
                paginatedProdutos.map((produto) => (
                  <div 
                    key={produto.id}
                    className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-semibold text-stone-700">{produto.name}</h4>
                      <p className="text-stone-600">Código: #{produto.id}</p>
                      <p className="text-stone-600">Quantidade: {produto.stock}</p>
                      <p className="text-stone-600">Categoria: {produto.category || 'Sem categoria'}</p>
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
                    {searchQuery.trim() !== "" 
                      ? `Nenhum produto encontrado para "${searchQuery}"` 
                      : "Nenhum produto encontrado"
                    }
                  </p>
                  
                  {searchQuery.trim() !== "" && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                    >
                      Limpar Busca
                    </button>
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
                            {hasSearch && ` encontrado${meta.total !== 1 ? 's' : ''}`}
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
                      <div>
                        Mostrando {meta.total === 1 ? '1 produto' : `todos os ${meta.total} produtos`}
                        {hasSearch && ` encontrado${meta.total !== 1 ? 's' : ''}`}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        produto={editingProduct}
        onSave={handleUpdate}
        onChange={setEditingProduct}
      />
      <DetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProduct(null);
        }}
        produto={selectedProduct}
      />
    </div>
  );
};