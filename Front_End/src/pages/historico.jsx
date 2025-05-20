import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from "../components/header"
import { Sidebar } from "../components/Sidebar/sidebar"
import { MdHistory } from "react-icons/md"

export const Historico = () => {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchRecentHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/products/recent/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecentItems(response.data);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      }
    };

    fetchRecentHistory();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(100vh-6rem)] overflow-y-auto mt-20 scrollbar-hide">
          <div className='border-b border-stone-400 px-4 mb-4 pb-4 sticky top-0 bg-white z-10'>
            <div className='flex items-center justify-between p-0.5'>
              <div>
                <h3 className='flex items-center gap-1.5 py-5 font-medium text-stone-600'>
                  <MdHistory className="text-stone-500 text-2xl" />
                  Histórico de Atividades
                </h3>
              </div>
            </div>
          </div>

          <div className='px-2'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12 p-4 border border-stone-400 rounded-md'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-sm font-semibold flex items-center gap-2 text-stone-700'>
                    Atividades Recentes
                  </h3>
                </div>
                <table className='w-full table-auto'>
                  <TableHead />
                  <tbody>
                    {recentItems.map((item) => (
                      <TableRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TableHead = () => {
  return (
    <thead>
      <tr className='text-sm font-normal text-stone-700'>
        <th className='text-start p-1.5'>ID</th>
        <th className='text-start p-1.5'>Nome do Produto</th>
        <th className='text-start p-1.5'>Data de Adição</th>
        <th className='text-start p-1.5'>Preço</th>
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
    <tr className='text-sm text-stone-600 border-t border-stone-200'>
      <td className='p-1.5 text-stone-500'>#{item.id}</td>
      <td className='p-1.5'>{item.name}</td>
      <td className='p-1.5'>{formatarData(item.createdAt)}</td>
      <td className='p-1.5'>{formatarPreco(item.price)}</td>
    </tr>
  )
}