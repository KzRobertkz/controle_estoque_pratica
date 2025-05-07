import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HiArchiveBox, 
  HiHome, 
  HiMagnifyingGlass 
} from "react-icons/hi2";
import { AiFillProduct } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";

import { useNavigate } from 'react-router-dom';

function Header() {
  const [mostrarPesquisa, setMostrarPesquisa] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3333/logout', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Erro ao fazer logout');
        return;
      }

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Erro na requisição de logout:', error);
    }
  };


  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow px-4 py-2 flex justify-between items-center text-sm z-50">
      
      {/* Menu à esquerda */}
      <div className="flex gap-6">
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
          className="py-0 px-0 flex flex-col items-center bg-white text-blue-600 hover:text-blue-800 transition-transform hover:scale-110 focus:outline-none"
        >
          <HiMagnifyingGlass className="text-3xl" />
          <span>Pesquisar</span>
        </button>

        <div
          className={`transition-all duration-500 transform ${
            mostrarPesquisa
              ? 'opacity-100 scale-100 translate-x-0'
              : 'opacity-0 scale-95 -translate-x-10 pointer-events-none'
          }`}
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

      <div 
        onClick={handleLogout}
        className="cursor-pointer py-0 flex flex-col items-end text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
      >
        <BiLogOut className="text-4xl" />
        <span className="text-base">Sair</span>
      </div>
    </div>
  );
}

export default Header;


