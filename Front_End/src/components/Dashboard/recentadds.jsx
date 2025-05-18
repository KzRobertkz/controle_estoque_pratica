import React, { useState, useEffect } from 'react'
import { FiClock } from 'react-icons/fi'
import axios from 'axios'

export const RecentAdds = () => {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/products/recent', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Remove o slice pois o limite já está no backend
        setRecentItems(response.data); 
      } catch (error) {
        console.error('Erro ao buscar itens recentes:', error);
      }
    };

    fetchRecentItems();
  }, []);

  return (
    <div className='col-span-12 p-4 border border-stone-400 rounded-md'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-sm hover:underline font-semibold flex items-center gap-2'>
          <FiClock className="text-stone-500" />
          Adições Recentes
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
    return new Date(data).toLocaleDateString('pt-BR');
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
      <td className='p-1.5'>{formatarData(item.created_at)}</td>
      <td className='p-1.5'>{formatarPreco(item.price)}</td>
    </tr>
  )
}