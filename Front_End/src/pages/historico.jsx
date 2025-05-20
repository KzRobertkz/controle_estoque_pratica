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

          <div className='px-4'> {/* padding horizontal */}
            <div className='grid grid-cols-12 gap-32'> {/* gap horizontal */}
              <div className='col-span-12 p-6 border border-stone-400 rounded-lg'> {/*  padding e border radius */}
                <div className='mb-6 flex items-center justify-between'> {/*  margin bottom */}
                  <h3 className='text-lg font-semibold flex items-center gap-3 text-stone-700'>
                    Atividades Recentes
                  </h3>
                </div>
                <table className='w-full table-auto'>
                  <TableHead />
                  <tbody className='divide-y divide-stone-200'> {/* Adicionado divisor entre linhas */}
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
    <tr className='text-base text-stone-600 hover:bg-stone-200 transition-colors duration-200 rounded-xl'>
      <td className='p-4 px-6 first:rounded-l-lg last:rounded-r-lg'>#{item.id}</td>
      <td className='p-4 px-6 first:rounded-l-lg last:rounded-r-lg'>{item.name}</td>
      <td className='p-4 px-6 first:rounded-l-lg last:rounded-r-lg'>{formatarData(item.createdAt)}</td>
      <td className='p-4 px-6 first:rounded-l-lg last:rounded-r-lg'>{formatarPreco(item.price)}</td>
    </tr>
  )
}