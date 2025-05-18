import React, { useState, useEffect } from 'react'
import { FiPackage } from 'react-icons/fi'
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#333"
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const ActivityGraph = () => {
  const [stockData, setStockData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // Função para formatar valores em reais
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para formatar números com separador de milhares
  const formatarQuantidade = (valor) => {
    return new Intl.NumberFormat('pt-BR').format(valor);
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const produtos = response.data.data;
        
        // Agrupa produtos por categoria
        const dadosAgrupados = produtos.reduce((acc, produto) => {
          const categoria = produto.name.split(' ')[0];
          
          if (!acc[categoria]) {
            acc[categoria] = {
              quantidade: 0,
              valorTotal: 0
            };
          }
          
          acc[categoria].quantidade += Number(produto.stock);
          acc[categoria].valorTotal += Number(produto.price) * Number(produto.stock);
          
          return acc;
        }, {});

        // Dados para o gráfico de linha
        const dadosFormatados = Object.entries(dadosAgrupados).map(([categoria, dados]) => ({
          name: categoria,
          quantidade: dados.quantidade,
          valorTotal: Number(dados.valorTotal.toFixed(2))
        }));

        // Dados para o gráfico de pizza (usando valor total)
        const dadosPizza = Object.entries(dadosAgrupados)
          .map(([categoria, dados]) => ({
            name: categoria,
            value: dados.valorTotal
          }))
          .sort((a, b) => b.value - a.value) // Ordena do maior para o menor valor
          .slice(0, 6); // Limita a 6 categorias para melhor visualização

        setStockData(dadosFormatados);
        setPieData(dadosPizza);
      } catch (error) {
        console.error('Erro ao buscar dados do estoque:', error);
      }
    };

    fetchStockData();
  }, []);

  return (
    <div className='grid grid-cols-12 gap-6'>
      {/* Gráfico de Linha */}
      <div className='col-span-8 rounded-lg border border-stone-400 p-4 bg-white shadow-sm'>
        <div className='mb-4'>
          <h3 className='flex items-center gap-1.5 font-medium text-stone-600'>
            <FiPackage className="text-stone-500" /> 
            Evolução do Estoque
          </h3>
        </div>
        <div className='h-[300px]'> 
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stockData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#888"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#82ca9d"
                fontSize={12}
                label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#8884d8"
                fontSize={12}
                label={{ value: 'Valor Total (R$)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'valorTotal') return [formatarMoeda(value), 'Valor Total'];
                  if (name === 'Quantidade em Estoque') return [formatarQuantidade(value), 'Quantidade'];
                  return [value, name];
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="quantidade" 
                name="Quantidade em Estoque"
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="valorTotal" 
                name="Valor Total"
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Pizza */}
      <div className='col-span-4 rounded-lg border border-stone-400 p-4 bg-white shadow-sm'>
        <div className='mb-4'>
          <h3 className='flex items-center gap-1.5 font-medium text-stone-600'>
            <FiPackage className="text-stone-500" /> 
            Distribuição por Categoria
          </h3>
        </div>
        <div className='h-[30vh] w-[44vh]'>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="#333"
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                    >
                      {`${name}: ${formatarMoeda(value)}`}
                    </text>
                  );
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatarMoeda(value)}
              />
              <Legend formatter={(value) => `${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
