import { useState } from "react";

export const ThemeComponent = () => {

    const [isDarkMode, setIsDarkMode] = useState(false);

    // Função toggle
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };


  return (

    <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-base font-medium text-stone-700">
                        Modo {isDarkMode ? 'Claro' : 'Escuro'}
                    </p>
                    <p className="text-sm text-stone-500">
                        Alterar aparência do sistema
                    </p>
                </div>
                          
                <button 
                    onClick={toggleTheme}
                    className={`relative inline-flex ml-3 h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
                    ${isDarkMode ? 'bg-blue-600' : 'bg-stone-200'}`}
                >
                    <span
                        className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out
                        ${isDarkMode ? 'left-[calc(100%-1.4rem)]' : 'left-0.5'}`}
                    />
                </button>
             </div>
        </div>
    </div>
  )
}
