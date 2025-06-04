
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DetailsModal = ({ isOpen, onClose, produto, getCategoryName }) => {
  if (!isOpen || !produto) return null;

  // Função para obter o nome do mês em português
  const getNomeMes = (numeroMes) => {
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return meses[numeroMes];
  };

  // Obtém o mês atual e os dois meses anteriores
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();

  // Função auxiliar para calcular mês anterior
  const getMesAnterior = (mes, quantidadeMeses) => {
    let novoMes = mes - quantidadeMeses;
    let novoAno = anoAtual;

    // Se o novo mês for negativo, ajusta o mês e o ano
    if (novoMes < 0) {
      novoMes = 12 + novoMes; // Converte para mês positivo
      novoAno = anoAtual - 1;
    }

    return { mes: novoMes, ano: novoAno };
  };

  // Cria array com os últimos 3 meses
  const dadosGrafico = [
    {
      mes: `${getNomeMes(getMesAnterior(mesAtual, 2).mes)}/${getMesAnterior(mesAtual, 2).ano}`,
      numeroMes: getMesAnterior(mesAtual, 2).mes,
      ano: getMesAnterior(mesAtual, 2).ano,
      preco: produto.historicoPre?.find(h => 
        h.mes === getMesAnterior(mesAtual, 2).mes && 
        h.ano === getMesAnterior(mesAtual, 2).ano
      )?.preco || null,
      estoque: produto.historicoPre?.find(h => 
        h.mes === getMesAnterior(mesAtual, 2).mes && 
        h.ano === getMesAnterior(mesAtual, 2).ano
      )?.estoque || null
    },
    {
      mes: `${getNomeMes(getMesAnterior(mesAtual, 1).mes)}/${getMesAnterior(mesAtual, 1).ano}`,
      numeroMes: getMesAnterior(mesAtual, 1).mes,
      ano: getMesAnterior(mesAtual, 1).ano,
      preco: produto.historicoPre?.find(h => 
        h.mes === getMesAnterior(mesAtual, 1).mes && 
        h.ano === getMesAnterior(mesAtual, 1).ano
      )?.preco || null,
      estoque: produto.historicoPre?.find(h => 
        h.mes === getMesAnterior(mesAtual, 1).mes && 
        h.ano === getMesAnterior(mesAtual, 1).ano
      )?.estoque || null
    },
    {
      mes: `${getNomeMes(mesAtual)}/${anoAtual}`,
      numeroMes: mesAtual,
      ano: anoAtual,
      preco: produto.price,
      estoque: produto.stock
    }
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
                <p className="text-stone-600">
                  <span className="font-medium">Categoria:</span> 
                  <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                    {getCategoryName ? getCategoryName(produto) : (produto.category || 'Sem categoria')}
                  </span>
                </p>
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
                    <Bar dataKey="preco" fill="#8884d8" name="Preço R$" />
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