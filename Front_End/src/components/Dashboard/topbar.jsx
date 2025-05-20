import React, { useState, useEffect } from 'react'
import { FiCalendar } from 'react-icons/fi'
import DatePicker, { registerLocale } from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
import "react-datepicker/dist/react-datepicker.css"

// Registra o locale pt-BR
registerLocale('pt-BR', ptBR)

export const Topbar = () => {
  const [user, setUser] = useState(null)
  const [dataAtual] = useState(new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())) // Define a data atual uma única vez
  const [dataSelecionada, setDataSelecionada] = useState(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

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

  const handleCalendarClick = () => {
    setIsCalendarOpen(!isCalendarOpen)
  }

  const handleDateChange = (date) => {
    setDataSelecionada(date)
    // Removida a atualização de dataAtual
  }

  // Função para formatar a data do botão
  const formatarDataBotao = (data) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short'
    }).format(data).replace('.', '')
  }

  return (
    <div className='border-b border-stone-400 px-4 mb-4 mt-2 pb-4'>
      <div className='flex items-center justify-between p-0.5'>
        <div>
          <span className='text- font-bold block text-zinc-700'>
            Bem vindo, {user?.fullName?.split(' ').slice(0, 2).join(' ')}
          </span>
          <span className='text-xs block text-zinc-600'>{dataAtual}</span>
        </div>

        <div className='relative'>
          <button 
            onClick={handleCalendarClick}
            className='flex text-sm items-center gap-2 bg-zinc-700 transition-colors hover:bg-zinc-500 px-3 py-2 rounded focus:outline-none'
          >
            <FiCalendar />
            <span>{formatarDataBotao(dataSelecionada)}</span>
          </button>
          
          {isCalendarOpen && (
            <div className='absolute right-0 top-12 z-10'>
              <DatePicker
                selected={dataSelecionada}
                onChange={handleDateChange}
                inline
                locale="pt-BR"
                dateFormat="dd 'de' MMMM 'de' yyyy"
                calendarClassName="bg-white shadow-lg rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
