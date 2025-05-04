import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HiArchiveBox, 
  HiHome, 
  HiMagnifyingGlass 
} from "react-icons/hi2";
import { AiFillProduct } from "react-icons/ai";



function Header() {
  const [mostrarPesquisa, setMostrarPesquisa] = useState(false);

  return (

    <div className="fixed top-0 left-0 w-full bg-white shadow p-4 flex gap-6 justify-start text-sm items-center z-50">
      
      <Link to="/Home" className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-transform hover:scale-110">
        <HiHome className="text-3xl" />
        <span>Home</span>
      </Link>

      <Link to="/Estoque" className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-transform hover:scale-110">
        <HiArchiveBox className="text-3xl" />
        <span>Estoque</span>
      </Link>

      <Link to="/Produtos" className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-transform hover:scale-110">
        <AiFillProduct className="text-3xl" />
        <span>Produtos</span>
      </Link>
      
      <button
        onClick={() => setMostrarPesquisa(!mostrarPesquisa)}
        className="flex flex-col items-center bg-white text-blue-600 hover:text-blue-800 transition-transform hover:scale-110 focus:outline-none focus:ring-0 p-0 rounded"
      >
        <HiMagnifyingGlass className="text-3xl" />
        <span>Pesquisar</span>
      </button>

      <div
        className={`transition-all duration-500 transform ${
          mostrarPesquisa
            ? 'opacity-100 scale-100 translate-x-0'
            : 'opacity-0 scale-95 -translate-x-10 pointer-events-none'
          }`
        }
      >
        <form
          action="/pesquisar"
          method="GET"
          className="flex items-center bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 shadow-md"
        >
          <input
            type="search"
            name="q"
            placeholder="Pesquisar..."
            className="bg-transparent w-72 px-3 py-1 text-blue-700 placeholder-blue-400 focus:outline-none"
            autoFocus={mostrarPesquisa}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Buscar
          </button>

        </form>

      </div>

    </div>

  );
}

export default Header;
