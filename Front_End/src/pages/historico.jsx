import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import Header from "../components/Header/header"
import { Sidebar } from "../components/Sidebar/sidebar"
import { MdHistory } from "react-icons/md"

export const Historico = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 25,
    firstPage: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchRecentHistory = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3333/products/recent/history/page', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: pageNumber
        }
      });
      
      const data = response.data;
      setRecentItems(data.data || []);
      
      // Atualiza meta informações da paginação
      setMeta({
        currentPage: Number(data.meta?.currentPage || pageNumber),
        lastPage: Number(data.meta?.lastPage || 1),
        total: Number(data.meta?.total || 0),
        perPage: Number(data.meta?.perPage || 25),
        firstPage: Number(data.meta?.firstPage || 1)
      });
      
      setError("");
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      if (error.response && error.response.status === 401) {
        setError("Você precisa estar logado para visualizar o histórico.");
      } else {
        setError("Erro ao carregar histórico. Por favor, tente novamente.");
      }
      setRecentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > meta.lastPage) return;
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber.toString());
    setSearchParams(newParams);
  };

  // Efeito para buscar dados quando a página muda
  useEffect(() => {
    const currentPage = Number(searchParams.get("page") || "1");
    fetchRecentHistory(currentPage);
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-auto mt-20 scrollbar-hide">
          <div className='border-b border-stone-400 px-4 mb-4 pb-4 sticky top-0 bg-white z-10'>
            <div className='flex items-center justify-between p-0.5'>
              <div>
                <h3 className='flex items-center gap-3 py-6 font-semibold text-xl text-stone-600'>
                  <MdHistory className="text-stone-500 text-3xl" />
                  Histórico de Atividades
                </h3>
              </div>
            </div>
          </div>

          <div className='px-4'>
            <div className='grid grid-cols-12 gap-32'>
              <div className='col-span-12 p-6 border border-stone-400 rounded-lg'>
                <div className='mb-6 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold flex items-center gap-3 text-stone-700'>
                    Atividades Recentes
                  </h3>
                  <div className='text-sm text-stone-500'>
                    Total: {meta.total} itens
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-stone-600">Carregando...</div>
                  </div>
                ) : (
                  <table className='w-full table-auto'>
                    <TableHead />
                    <tbody className='divide-y divide-stone-200'>
                      {recentItems.length > 0 ? (
                        recentItems.map((item) => (
                          <TableRow key={item.id} item={item} />
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-stone-500">
                            Nenhum item encontrado no histórico
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Paginação */}
          {meta.lastPage > 1 && (
            <div className="mt-6 px-4">
              <div className="flex justify-center items-center gap-2">
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

                <div className="flex gap-1">
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, meta.currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(meta.lastPage, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => goToPage(i)}
                          className={`px-3 py-2 rounded focus:outline-none transition-colors ${
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
                </div>

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
              
              <div className="text-center mt-2 text-sm text-stone-500">
                Página {meta.currentPage} de {meta.lastPage} | 
                {' '}Mostrando {((meta.currentPage - 1) * meta.perPage) + 1} - {Math.min(meta.currentPage * meta.perPage, meta.total)} de {meta.total} itens
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const TableHead = () => {
  return (
    <thead>
      <tr className='text-lg font-medium text-stone-700'>
        <th className='text-start p-4 px-6'>ID</th>
        <th className='text-start p-4 px-6'>Nome do Produto</th>
        <th className='text-start p-4 px-6'>Data de Adição</th>
        <th className='text-start p-4 px-6'>Preço</th>
      </tr>
    </thead>
  )
}

const TableRow = ({ item }) => {
  const formatarData = (data) => {
    try {
      if (!data) return 'Data não disponível';
      const date = new Date(data);
      if (isNaN(date.getTime())) return 'Data inválida';
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(date);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  return (
    <tr className='text-base text-stone-600 hover:bg-stone-50 transition-colors duration-200'>
      <td className='p-4 px-6'>#{item.id}</td>
      <td className='p-4 px-6'>{item.name}</td>
      <td className='p-4 px-6'>{formatarData(item.createdAt)}</td>
      <td className='p-4 px-6'>{formatarPreco(item.price)}</td>
    </tr>
  )
}