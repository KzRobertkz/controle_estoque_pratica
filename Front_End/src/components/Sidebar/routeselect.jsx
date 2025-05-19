import React from 'react'
import { FiHome, FiUsers } from 'react-icons/fi'
import { MdHistory } from "react-icons/md";
import { DiAptana } from "react-icons/di";

export const RouteSelect = () => {
  return (
    <div className='space-y-1'>
        <Route 
          Icon={FiHome} 
          title="Dashboard" 
          selected={true} 
        />

        <Route 
          Icon={FiUsers} 
          title="Usuários" 
          selected={false} 
        />

        <Route 
          Icon={MdHistory} 
          title="Histórico" 
          selected={false} 
        />

        <Route 
          Icon={DiAptana} 
          title="Configurações" 
          selected={false} 
        />

    </div>
  )
}

const Route = ({ selected, Icon, title }) => {
  return (
    <button
      className={`
        flex items-center gap-2 px-2 py-2 w-full justify-start duration-200 text-sm transition-[box-shadow background-color,_color]
        ${selected 
          ? 'bg-zinc-950 text-zinc-100 shadow' 
          : 'hover:bg-zinc-950/70 text-zinc-400 '
          
        }
      `}
    >
      <Icon size={20} />
      <span className="font-medium">{title}</span>
    </button>
  )
}