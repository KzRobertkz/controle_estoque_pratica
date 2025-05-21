import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArchiveBox, HiHome, HiMagnifyingGlass } from "react-icons/hi2";
import { AiFillProduct } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useSearch } from "./searchcontent";
import { CommandMenu } from './commandbar';

function Header() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { hideSearch } = useSearch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:3333/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3333/logout", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Erro ao fazer logout");
        return;
      }

      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Erro na requisição de logout:", error);
    }
  };

  return (
    <>
      <CommandMenu open={commandOpen} setOpen={setCommandOpen} />
      <header>
        <div className="fixed top-0 left-0 right-0 mx-4 ">
          <div className="w-full bg-white shadow pl-7 pr-5 py-2 flex justify-between items-center text-sm z-50 rounded-lg">
            {/* Menu à esquerda */}
            <div className="flex gap-6 items-center">
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

              {/* Botão CMDK com animação de transição */}
              <div 
                className={`
                  transform transition-all duration-300 ease-in-out flex
                  ${hideSearch 
                    ? 'opacity-0 scale-95 -translate-x-0 max-w-0 pointer-events-none invisible' 
                    : 'opacity-100 scale-100 translate-x-0 max-w-[100px] pointer-events-auto visible'
                  }
                `}
              >
                <button
                  onClick={() => setCommandOpen(true)}
                  className="py-0 px-0 flex flex-col bg-white text-blue-600 hover:text-blue-800 transition-transform hover:scale-110 focus:outline-none whitespace-nowrap"
                >
                  <HiMagnifyingGlass className="text-3xl ml-4" />
                  <div className="flex gap-1">
                    <span>Pesquisar</span>
                    <kbd className="hidden sm:inline-flex text-xs border border-gray-500 rounded px-1.5 py-0.5 bg-gray-200 text-gray-800">
                      ⌘+K / Ctrl+K
                    </kbd>
                  </div>
                </button>
              </div>
            </div>

            {/* Nome do usuário + logout */}
            <div className="flex items-center gap-8 text-blue-600 hover:text-blue-800">
              {/* Exibe o primeiro nome */}
              {user?.fullName && (
                <div className="flex flex-col items-center text-blue-600 font-medium text-base hover:text-blue-800 transition-transform hover:scale-110">
                  <CgProfile className="text-4xl" />
                  {user.fullName.split(" ")[0]} 
                </div>
              )}

              <div onClick={handleLogout} className="cursor-pointer py-0 flex flex-col items-end text-blue-600 hover:text-blue-800 transition-transform hover:scale-110">
                <BiLogOut className="text-4xl" />
                <span className="text-base text-blue-700">Sair</span>
              </div>
            </div>
          </div>
        </div>
        {!hideSearch && (
          <div className="search-container">
            {/* seu componente de pesquisa aqui */}
          </div>
        )}
      </header>
    </>
  );
}

export default Header;


