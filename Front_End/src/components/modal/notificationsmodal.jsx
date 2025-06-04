import { useState } from 'react';
import { FiX, FiBell, FiAlertCircle, FiClock, FiPackage } from 'react-icons/fi';

export const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'stock',
      title: 'Estoque Baixo',
      message: 'Produto X está com estoque abaixo do limite',
      date: '2024-03-10T10:00:00',
      read: false
    },
    {
      id: 2,
      type: 'expiry',
      title: 'Produto Próximo ao Vencimento',
      message: 'Produto Y vai vencer em 5 dias',
      date: '2024-03-09T15:30:00',
      read: true
    }
  ]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'stock':
        return <FiPackage className="text-yellow-500" />;
      case 'expiry':
        return <FiClock className="text-red-500" />;
      default:
        return <FiAlertCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px] max-h-[80vh] shadow-xl">
        {/* Cabeçalho */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiBell className="text-blue-600" />
            Notificações
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Lista de Notificações */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <span className="text-sm text-gray-500 mt-2 block">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma notificação encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
