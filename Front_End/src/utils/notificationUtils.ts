export const shouldShowNotifications = (): boolean => {
    try {
        const isHidden: string | null = localStorage.getItem('isNotificationsHidden');
        
        if (isHidden === null) {
            return true;
        }
        
        const parsedValue: boolean = JSON.parse(isHidden);
        return !parsedValue;
    } catch (error) {
        // Em caso de erro no parsing ou acesso ao localStorage,
        // retorna true como valor padrão
        console.warn('Erro ao acessar configuração de notificações:', error);
        return true;
    }
};