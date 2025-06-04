import { useState, useEffect } from "react";
import { Topbar } from "./topbar";
import { Grid } from "./grid";

export const Dashboard = () => {
    // Estado para controlar se o calendário está escondido
    // Inicializa com o valor do localStorage ou false como padrão
    const [isCalendarHidden] = useState(() => {
        const saved = localStorage.getItem('isCalendarHidden');
        return saved ? JSON.parse(saved) : false;
    });

    // Salva o estado no localStorage sempre que ele mudar
    useEffect(() => {
        localStorage.setItem('isCalendarHidden', JSON.stringify(isCalendarHidden));
    }, [isCalendarHidden]);

    return (
        <div className="rounded-lg bg-white pb-3 shadow h[200vh] mt-20">
            {/* Passa o estado isCalendarHidden para o Topbar */}
            <Topbar isCalendarHidden={isCalendarHidden} />
            <Grid />
        </div>
    );
};