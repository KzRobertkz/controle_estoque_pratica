import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DetailsModal = ({ isOpen, onClose, produto }) => {
  if (!isOpen || !produto) return null;

  // Dados simulados para o gráfico - você deve substituir por dados reais
  const dadosGrafico = [
    { mes: 'Jan', preco: produto.price - 10, estoque: produto.stock - 5 },
    { mes: 'Fev', preco: produto.price - 5, estoque: produto.stock - 3 },
    { mes: 'Mar', preco: produto.price, estoque: produto.stock }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-stone-700">
            Detalhes do Produto: -- {produto.name} --
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-500 px-2 py-1 bg-white hover:text-stone-700 text-xl focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Produto */}
          <div className="space-y-4">
            <div className="bg-stone-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-stone-700 mb-3">
                Informações Gerais
              </h3>
              <div className="space-y-2">
                <p className="text-stone-600"><span className="font-medium">Código:</span> #{produto.id}</p>
                <p className="text-stone-600"><span className="font-medium">Categoria:</span> {produto.category}</p>
                <p className="text-stone-600"><span className="font-medium">Preço Atual:</span> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.price)}</p>
                <p className="text-stone-600"><span className="font-medium">Estoque Atual:</span> {produto.stock} unidades</p>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-stone-700 mb-3">
                Descrição do Produto
              </h3>
              <p className="text-stone-600">
                {produto.description || "Nenhuma descrição disponível"}
              </p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="space-y-6">
            <div className="bg-stone-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-stone-700 mb-3">
                Variação de Preço e Estoque
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="preco" fill="#8884d8" name="Preço" />
                    <Bar dataKey="estoque" fill="#82ca9d" name="Estoque" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
