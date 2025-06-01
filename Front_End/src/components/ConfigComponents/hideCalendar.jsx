import { useState, useEffect } from "react"

export const HideCalendarComponent = ({ onCalendarToggle }) => {
    // Inicializa o estado com o valor do localStorage
    const [HideCalendar, setHideCalendar] = useState(() => {
        const saved = localStorage.getItem('isCalendarHidden');
        return saved ? JSON.parse(saved) : false;
    });

    // Sincroniza o estado local com o localStorage quando o componente monta
    useEffect(() => {
        const saved = localStorage.getItem('isCalendarHidden');
        if (saved) {
            const parsedValue = JSON.parse(saved);
            setHideCalendar(parsedValue);
            // Garante que o componente do Dashboard também receba o estado correto
            if (onCalendarToggle) {
                onCalendarToggle(parsedValue);
            }
        }
    }, [onCalendarToggle]);

    // Função toggle
    const toggleCalendar = () => {
        const newState = !HideCalendar;
        setHideCalendar(newState);
        
        // Salva no localStorage
        localStorage.setItem('isCalendarHidden', JSON.stringify(newState));
        
        // Chama a função callback para comunicar a mudança
        if (onCalendarToggle) {
            onCalendarToggle(newState);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-stone-700">
                        Remover o calendário do Dashboard
                    </p>
                    <p className="text-base text-stone-500">
                        Remove o calendário no cabeçalho do Dashboard
                    </p>
                </div>
                          
                <button 
                    onClick={toggleCalendar}
                    className={`relative inline-flex ml-3 h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
                    ${HideCalendar ? 'bg-blue-600' : 'bg-stone-200'}`}
                >
                    <span
                        className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out
                        ${HideCalendar ? 'left-[calc(100%-1.4rem)]' : 'left-0.5'}`}
                    />
                </button>
            </div>
        </div>
    )
}