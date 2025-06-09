import { useState, useEffect } from "react"

export const NoNotificationsComponent = ({ onNotificationsToggle }) => {
    // Renamed to better reflect its purpose
    const [hideNotifications, setHideNotifications] = useState(() => {
        const saved = localStorage.getItem('isNotificationsHidden');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        const saved = localStorage.getItem('isNotificationsHidden');
        if (saved) {
            const parsedValue = JSON.parse(saved);
            setHideNotifications(parsedValue);
            if (onNotificationsToggle) {
                onNotificationsToggle(parsedValue);
            }
        }
    }, [onNotificationsToggle]);

    const toggleNotifications = () => {
        const newState = !hideNotifications;
        setHideNotifications(newState);
        
        localStorage.setItem('isNotificationsHidden', JSON.stringify(newState));
        
        if (onNotificationsToggle) {
            onNotificationsToggle(newState);
        }

        // Add timeout for reload
        setTimeout(() => {
            window.location.reload();
        }, 400);
    };

    return (
        <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-stone-700">
                        Remover as notificações
                    </p>
                    <p className="text-base text-stone-500">
                        Remove as notificações de alertas de estoque e <br /> esconde o icone no cabeçalho da pagina
                    </p>
                </div>
                          
                <button 
                    onClick={toggleNotifications}
                    className={`relative inline-flex ml-3 h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none
                    ${hideNotifications ? 'bg-blue-600' : 'bg-stone-200'}`}
                >
                    <span
                        className={`absolute h-5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out
                        ${hideNotifications ? 'left-[calc(100%-1.4rem)]' : 'left-0.5'}`}
                    />
                </button>
            </div>
        </div>
    )
}
