import React, { useState, useEffect } from 'react'
import { FiCalendar } from 'react-icons/fi';

export const Topbar = () => {
  const [user, setUser] = useState(null);

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

  return (
    <div className='border-b border-stone-400 px-4 mb-4 mt-2 pb-4'>
        <div className='flex items-center justify-between p-0.5 '>
            <div>
                <span className='text-sm font-bold block text-zinc-700'>
                    Bem vindo, {user?.fullName?.split(' ').slice(0 , 2).join(' ')}
                </span>
                <span className='text-xs block text-zinc-500'>Tuesday, May 18th</span>
            </div>

            <button className='flex text-sm items-center gap-2 bg-zinc-400 transition-colors hover:bg-zinc-500 px-3 py-2 rounded'>
                <FiCalendar />
                <span>Prev 7 months</span>
            </button>
        </div>
    </div>
  )
}
