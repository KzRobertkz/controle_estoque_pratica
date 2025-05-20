import React from 'react'
import { FiHome, FiUsers } from 'react-icons/fi'
import { MdHistory } from "react-icons/md"
import { DiAptana } from "react-icons/di"
import { useLocation, useNavigate } from 'react-router-dom'

export const RouteSelect = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const routes = [
    {
      path: '/home',
      Icon: FiHome,
      title: 'Dashboard'
    },
    {
      path: '/usuarios',
      Icon: FiUsers,
      title: 'Usuários'
    },
    {
      path: '/historico',
      Icon: MdHistory,
      title: 'Histórico'
    },
    {
      path: '/configuracoes',
      Icon: DiAptana,
      title: 'Configurações'
    }
  ]

  return (
    <div className='space-y-1'>
      {routes.map((route) => (
        <Route 
          key={route.path}
          Icon={route.Icon} 
          title={route.title} 
          selected={location.pathname === route.path}
          onClick={() => navigate(route.path)}
        />
      ))}
    </div>
  )
}

const Route = ({ selected, Icon, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-2 py-2 w-full justify-start duration-200 text-sm
        ${selected 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'hover:bg-blue-50 text-blue-600 hover:text-blue-800'
        }
        rounded-lg transition-all
      `}
    >
      <Icon size={20} />
      <span className="font-medium">{title}</span>
    </button>
  )
}