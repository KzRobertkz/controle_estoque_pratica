import React, { useState, useEffect } from 'react'
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi'
import axios from 'axios'

export const Statcards = () => {
  const [estoqueInfo, setEstoqueInfo] = useState({
    totalProdutos: 0,
    valorTotal: 0,
    variacao: {
      produtos: 0,
      valor: 0
    }
  });

  useEffect(() => {
    const fetchEstoqueInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const produtos = response.data.data;
        
        // Calcula totais
        const totalProdutos = produtos.reduce((acc, prod) => acc + Number(prod.stock), 0);
        const valorTotal = produtos.reduce((acc, prod) => acc + (Number(prod.price) * Number(prod.stock)), 0);
        
        // Calcula variação (exemplo: comparando com mês anterior)
        // Aqui você pode implementar sua própria lógica de variação
        const variacaoProdutos = ((totalProdutos - 100) / 100) * 100; // exemplo
        const variacaoValor = ((valorTotal - 1000) / 1000) * 100; // exemplo

        setEstoqueInfo({
          totalProdutos,
          valorTotal,
          variacao: {
            produtos: variacaoProdutos,
            valor: variacaoValor
          }
        });

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchEstoqueInfo();
  }, []);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <>
      <Card  
        title="Total em Estoque" 
        value={`${estoqueInfo.totalProdutos} unidades`}
        pilltext={`${Math.abs(estoqueInfo.variacao.produtos).toFixed(2)}%`}
        trend={estoqueInfo.variacao.produtos >= 0 ? "up" : "down"}
        period="Comparado ao mês anterior"
      />
      <Card 
        title="Valor Total" 
        value={formatarMoeda(estoqueInfo.valorTotal)}
        pilltext={`${Math.abs(estoqueInfo.variacao.valor).toFixed(2)}%`}
        trend={estoqueInfo.variacao.valor >= 0 ? "up" : "down"}
        period="Comparado ao mês anterior"
      />
    </>
  )
}

const Card = ({ title, value, pilltext, trend, period }) => {
  return (
    <div className='p-4 border-stone-400 col-span-4 rounded-md border'>
      <div className='flex mb-8 items-start justify-between gap-20'>
        <div>
          <h3 className='text-stone-500 mb-2 text-sm'>{title}</h3>
          <p className='text-3xl font-semibold'>{value}</p>
        </div>

        <span className={`text-xs inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded-sm whitespace-nowrap ${
            trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
          {trend === "up" ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}

          {pilltext}
        </span>
      </div>

      <p className='text-xs text-stone-500 '>
        {period}
      </p>
    </div>
  )
}