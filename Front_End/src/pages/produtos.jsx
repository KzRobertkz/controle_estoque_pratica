import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from "../components/header"
import { Sidebar } from "../components/Sidebar/sidebar"
import { MdOutlineInventory2 } from "react-icons/md"

export const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Dados da API:', response.data); // log
        // Aqui está a correção - acessando response.data.data
        setProdutos(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao carregar produtos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
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

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
          <Sidebar />
          <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-auto mt-20 scrollbar-hide flex items-center justify-center">
            <p className="text-lg text-red-500">{error}</p>
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
                <h3 className='flex items-center gap-3 py-6 font-semibold text-xl text-stone-600'>
                  <MdOutlineInventory2 className="text-stone-500 text-3xl" />
                  Produtos
                </h3>
              </div>
            </div>
          </div>

          <div className='px-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.isArray(produtos) && produtos.length > 0 ? (
                produtos.map((produto) => (
                  <div 
                    key={produto.id}
                    className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-semibold text-stone-700">{produto.name}</h4>
                      <p className="text-stone-600">Código: #{produto.id}</p>
                      <p className="text-stone-600">Quantidade: {produto.quantity}</p>
                      <p className="text-stone-600">Categoria: {produto.category}</p>
                      <p className="text-lg font-medium text-stone-700">{formatarPreco(produto.price)}</p>
                      <div className="mt-4 flex justify-end gap-3">
                        <button className="px-4 py-2 bg-stone-100 text-stone-600 rounded-md hover:bg-stone-200 transition-colors duration-200">
                          Detalhes
                        </button>
                        <button className="px-4 py-2 bg-stone-100 text-stone-600 rounded-md hover:bg-stone-200 transition-colors duration-200">
                          Editar
                        </button>
                        <button className="px-4 py-2 bg-stone-100 text-stone-600 rounded-md hover:bg-stone-200 transition-colors duration-200">
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center py-8">
                  <p className="text-lg text-stone-500">Nenhum produto encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};







