import { useEffect, useState } from "react";
import axios from 'axios';
import Header from "../components/header";
import { useSearchParams } from "react-router-dom";

import { FaFilter } from "react-icons/fa";
import { HiMiniTag } from "react-icons/hi2";

function Estoque() {

  const api = axios.create({
    baseURL: "http://localhost:3333",
    withCredentials: true,
  });

  // Mecanicas dos Produtos
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);

  // Mecanicas de pesquisa
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // Extraindo a página atual dos parâmetros da URL mais explicitamente
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  // Debug intercept para verificar todas as chamadas API
  api.interceptors.response.use(
    (response) => {
      console.log("API Response Success:", response.config.url, response.data);
      return response;
    },
    (error) => {
      console.error("API Response Error:", error.config?.url, error);
      return Promise.reject(error);
    }
  );

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config.url, config.params);
    return config;
  });


  // Funções 
  const fetchProducts = async (pageNumber = 1, query = "") => {
    try {
      console.log(`Fazendo requisição para página com busca "${query}"`);
      
      const res = await api.get("/products", {
        params: { page: pageNumber, search: query },
      });
      
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      const metaData = res.data.meta || {};
      
      console.log("Meta antes de atualizar:", metaData); // Debug

      setProducts(data);
      setMeta({
        currentPage: Number(metaData.currentPage || pageNumber),
        lastPage: Number(metaData.lastPage || Math.ceil(data.length / 10)),
        total: Number(metaData.total || data.length),
        perPage: Number(metaData.perPage || 10),
        firstPage: Number(metaData.firstPage || 1)
      });

      console.log("Meta após atualizar:", {
        currentPage: Number(metaData.currentPage || pageNumber),
        lastPage: Number(metaData.lastPage || Math.ceil(data.length / 10)),
        total: Number(metaData.total || data.length),
        perPage: Number(metaData.perPage || 10),
        firstPage: Number(metaData.firstPage || 1)
      }); // Debug

      setError("");
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      if (err.response && err.response.status === 401) {
        setError("Você precisa estar logado para visualizar produtos.");
      } else {
        setError("Erro ao carregar produtos. Por favor, tente novamente.");
      }
    }
  };


  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > meta.lastPage) return;
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber.toString());
    setSearchParams(newParams);
  };



  // Efeitos
  // Inicializa o valor de busca a partir dos parâmetros da URL
  useEffect(() => {
    const searchFromParams = searchParams.get("search") || "";
    const newPage = Number(searchParams.get("page") || "1");

    if (searchQuery !== searchFromParams) {
      setSearchQuery(searchFromParams);
    }

    fetchProducts(newPage, searchFromParams);
  }, [searchParams]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
      };

      if (editingProductId) {
        const res = await api.put(`/products/${editingProductId}`, productData);
        setProducts(products.map(p => (p.id === editingProductId ? res.data : p)));
        setSuccessMessage("Produto atualizado com sucesso!");
      } else {
        await api.post('/products', productData);
        // Recarregar a primeira página após adicionar um produto
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", "1");
        setSearchParams(newParams);
        fetchProducts(1, searchQuery); // Forçar atualização da página 1
        setSuccessMessage("Produto adicionado com sucesso!");
      }

      setNewProduct({ name: '', description: '', price: '', stock: '' });
      setEditingProductId(null);
      setTimeout(() => setSuccessMessage(''), 3000);
      setError('');
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError('Erro ao salvar produto. Verifique os dados e tente novamente.');
    }
  };

  


  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    setEditingProductId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewProduct({ name: '', description: '', price: '', stock: '' });
    setEditingProductId(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(product => product.id !== productId));
        setSuccessMessage('Produto excluído com sucesso!');
        
        // Se após excluir não houver mais produtos na página atual e não for a primeira página
        if (products.length === 1 && page > 1) {
          goToPage(page - 1);
        } else {
          // Recarregar a página atual para atualizar a paginação
          fetchProducts(page, searchQuery);
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        let errorMessage = 'Erro ao excluir produto.';
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Você precisa estar logado para excluir produtos.';
          } else if (err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
        setError(errorMessage);
      }
    }
  };

  // Verificar se há mais de 10 produtos no total para estilizar o botão de próximo
  // Sempre consideramos que há mais de 10 produtos se houver mais de uma página
  const hasMoreThan10Products = meta.lastPage > 1;

  console.log("Renderizando com meta:", meta);
  console.log("Condição de renderização da paginação:", meta.lastPage > 1);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-700 mb-4">Estoque de Produtos</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Pesquisar produto"
            value={searchQuery}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchQuery(newValue);
              
              // Atualiza os parâmetros da URL mantendo a consistência
              const newParams = new URLSearchParams(searchParams);
              newParams.set("search", newValue);
              newParams.set("page", "1"); // Reset to page 1 on search change
              setSearchParams(newParams);
            }}
            className="p-2 mt-6 border rounded w-full"
          />
          <FaFilter className="mt-8 text-3xl text-blue-600 hover:text-blue-800 transition-transform hover:scale-110" />
          <HiMiniTag className="mt-7 text-4xl text-blue-600 hover:text-blue-800 transition-transform hover:scale-110" />
        </div>

        {/* Formulário para Adicionar/Editar Produto */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProductId ? "Editar Produto" : "Adicionar Novo Produto"}
          </h2>
          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nome do Produto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Descrição"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Preço"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Estoque"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="p-2 border rounded"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {editingProductId ? "Atualizar Produto" : "Adicionar Produto"}
              </button>

              {editingProductId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <p className="text-gray-800">
                      Preço: <span className="text-green-600 font-medium">R$ {Number(product.price).toFixed(2)}</span>
                    </p>
                    <p className="text-gray-800">Estoque: {product.stock} unidades</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <p className="mb-4">Nenhum produto encontrado.</p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className={`px-4 py-2 rounded ${
                    page <= 1
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Voltar
                </button>

                <button
                  onClick={() => fetchProducts(page, searchQuery)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Recarregar
                </button>
              </div>
            </div>
          )}
        </div> {/* Fechamento do grid de produtos */}

        {/* Paginação separada */}
        <div className="mt-6">
          {console.log("Estado atual do meta:", meta)} {/* Debug */}
          {meta.lastPage > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => goToPage(meta.currentPage - 1)}
                disabled={meta.currentPage <= 1}
                className={`px-4 py-2 rounded ${
                  meta.currentPage <= 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Anterior
              </button>

              {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-4 py-2 rounded ${
                    pageNum === meta.currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => goToPage(meta.currentPage + 1)}
                disabled={meta.currentPage >= meta.lastPage}
                className={`px-4 py-2 rounded ${
                  meta.currentPage >= meta.lastPage
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Estoque;