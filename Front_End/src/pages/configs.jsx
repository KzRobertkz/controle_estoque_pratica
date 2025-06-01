import { useState, useEffect } from 'react';

// Componentes principais
import Header from '../components/Header/header';
import { Sidebar } from '../components/Sidebar/sidebar';
import { FiSettings, FiAlertTriangle } from 'react-icons/fi';


// Componentes de configurações 
import { HideSearchComponent } from '../components/ConfigComponents/hideSearch';
import { ThemeComponent } from '../components/ConfigComponents/theme';
import { UserPhotoComponent } from '../components/ConfigComponents/userPhoto';
import { HideCalendarComponent } from '../components/ConfigComponents/hideCalendar';

// Componentes de configurações de risco - Configurações do usuário
import { EditPasswordComponent } from '../components/ConfigComponents/AreaRiscoComponents/editPassword';
import { EditNameComponent } from '../components/ConfigComponents/AreaRiscoComponents/editName';
import { EditEmailComponent } from '../components/ConfigComponents/AreaRiscoComponents/editEmail';
import { DeleteUserComponent } from '../components/ConfigComponents/AreaRiscoComponents/deleteUser';

export const Configuracoes = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        
        <div className="rounded-lg bg-white pb-3 shadow h-[calc(98vh-6rem)] overflow-y-auto mt-20 w-full scrollbar-hide">
          {/* Cabeçalho da página */}
          <div className="border-b border-stone-400 px-4 mb-4 pb-4 sticky bg-white z-10">
            <div className="flex items-center justify-between p-0.5">
              <div>
                <h3 className="flex items-center gap-3 py-6 font-semibold text-xl text-stone-600">
                  <FiSettings className="text-stone-500 text-2xl" />
                  Configurações do Sistema
                </h3>
              </div>
            </div>
          </div>

          {/* Configurações Gerais */}
          <div className="px-4">
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12 p-4 border border-stone-400 rounded-md w-full">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-3 text-stone-700">
                    Configurações Gerais
                  </h3>
                </div>

                <div className="space-y-3">
                  <HideSearchComponent />
                  <HideCalendarComponent />
                  <UserPhotoComponent /> 
                </div>
              </div>
            </div>
          </div>

          {/* Configurações do Tema */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12 p-4 border border-stone-400 rounded-md w-full">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-3 text-stone-700">
                    Configurações do Tema
                  </h3>
                  <h3 className='text-blue-500 font-semibold text-lg'>
                    ⭐BETA
                  </h3>
                </div>
                
                <ThemeComponent />
              </div>
            </div>
          </div>
          
          {/* Área de Risco - Configurações do Usuário */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <FiAlertTriangle className="text-red-500 text-2xl" />
              <h3 className="text-xl font-bold text-red-500">
                Área de Risco
              </h3>
            </div>
            
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12 p-4 border-2 border-red-500 rounded-md w-full bg-red-50">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-3 text-stone-700">
                    Configurações do Usuário
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {/* Componente de Editar Senha */}
                  <EditPasswordComponent />
                  
                  {/* Componente de Editar Nome */}
                  <EditNameComponent />
                  
                  {/* Componente de Editar Email */}
                  <EditEmailComponent />
                  
                  {/* Componente de Excluir Usuário */}
                  <DeleteUserComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};