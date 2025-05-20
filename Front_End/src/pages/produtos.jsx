import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from "../components/header"
import { Sidebar } from "../components/Sidebar/sidebar"
import { MdOutlineInventory2 } from "react-icons/md"
import { EditModal } from '../components/modal/editmodal';
import { DetailsModal } from '../components/modal/detailsmodal';

export const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        
        console.log('Dados dos produtos:', response.data.data); //  debug
        const produtosOrdenados = response.data.data.sort((a, b) => b.id - a.id);
        setProdutos(Array.isArray(produtosOrdenados) ? produtosOrdenados : []);
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
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(preco));
  };

  const handleDelete = async (id) => {
    const confirmacao = window.confirm('Tem certeza que deseja excluir este produto?');
    
    if (confirmacao) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3333/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProdutos(produtos.filter(produto => produto.id !== id));
        alert('Produto excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
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
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3333/products/${editingProduct.id}`, editingProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProdutos(produtos.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      ));
      
      setIsEditModalOpen(false);
      setEditingProduct(null);
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto');
    }
  };

  const handleShowDetails = (produto) => {
    setSelectedProduct(produto);
    setIsDetailsModalOpen(true);
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

              <div>
                <button className="px-4 py-2 bg-stone-300 text-stone-800 rounded-md hover:text-stone-600 hover:bg-stone-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300">
                  Nova Categoria
                </button>
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
                      <p className="text-stone-600">Quantidade: {produto.stock}</p>
                      <p className="text-stone-600">Categoria: {produto.category}</p>
                      <p className="text-lg font-medium text-stone-700">{formatarPreco(produto.price)}</p>
                      <div className="mt-4 flex justify-end gap-3">
                        <button 
                          onClick={() => handleShowDetails(produto)}
                          className="px-4 py-2 bg-stone-100 text-stone-600 rounded-md hover:bg-stone-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        >
                          Detalhes
                        </button>
                        <button 
                          onClick={() => handleEdit(produto)}
                          className="px-4 py-2 bg-stone-100 text-stone-600 rounded-md hover:bg-stone-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(produto.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
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







