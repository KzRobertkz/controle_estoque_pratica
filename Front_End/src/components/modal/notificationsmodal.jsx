import { useState, useEffect } from 'react';
import { FiX, FiBell, FiAlertCircle, FiClock, FiPackage, FiCheck, FiTrash, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

export const NotificationsModal = ({ isOpen, onClose, onNotificationsUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    withCredentials: true
  });

  // Adicionar interceptor para token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Função para criar data local corretamente
  const createLocalDate = (dateString) => {
    if (!dateString) return null;
    
    // Se já é um objeto Date, retorna ele mesmo
    if (dateString instanceof Date) return dateString;
    
    // Remove timezone se existir e força interpretação como local
    const cleanDateString = dateString.toString().split('T')[0];
    const [year, month, day] = cleanDateString.split('-').map(Number);
    
    // Cria a data no horário local (não UTC)
    return new Date(year, month - 1, day);
  };

  // Função para formatar data corretamente
  const formatDateCorrectly = (dateString) => {
    const date = createLocalDate(dateString);
    if (!date || isNaN(date.getTime())) return 'Data inválida';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    }).format(date);
  };

  // Funções para gerenciar estado das notificações no localStorage
  const getNotificationState = () => {
    try {
      const saved = localStorage.getItem('notificationState');
      return saved ? JSON.parse(saved) : {
        readNotifications: [],
        deletedNotifications: [],
        hiddenNotifications: false
      };
    } catch (error) {
      return {
        readNotifications: [],
        deletedNotifications: [],
        hiddenNotifications: false
      };
    }
  };

  const saveNotificationState = (state) => {
    try {
      localStorage.setItem('notificationState', JSON.stringify(state));
    } catch (error) {
      console.error('Erro ao salvar estado das notificações:', error);
    }
  };

  const isNotificationRead = (notificationId) => {
    const state = getNotificationState();
    return state.readNotifications.includes(notificationId);
  };

  const isNotificationDeleted = (notificationId) => {
    const state = getNotificationState();
    return state.deletedNotifications.includes(notificationId);
  };

  const areNotificationsHidden = () => {
    const state = getNotificationState();
    return state.hiddenNotifications;
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Verificar se as notificações estão escondidas
      if (areNotificationsHidden()) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      // Buscar produtos - sempre ativo independente das configurações globais
      const products = await fetchAllProducts();
      console.log('Produtos carregados:', products.length); // Debug

      // Remove o parâmetro notificationSettings que não é mais necessário
      const generatedNotifications = generateNotifications(products);
      console.log('Notificações geradas:', generatedNotifications.length); // Debug
      setNotifications(generatedNotifications);

    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setError('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      let allData = [];
      let currentPage = 1;
      let hasMoreData = true;
      
      while (hasMoreData) {
        const response = await api.get("/products", {
          params: { 
            page: currentPage,
            per_page: 100
          }
        });
        
        const pageData = Array.isArray(response.data.data) 
          ? response.data.data.map(product => ({
              ...product,
              // Corrigir os campos para garantir que estejam no formato correto
              validate_date: product.validateDate || product.validate_date,
              min_stock: Number(product.min_stock || 0),
              stock: Number(product.stock || 0),
              alert_days: Number(product.alert_days || 0)
            }))
          : [];

        console.log('Exemplo de produto processado:', pageData[0]); // Debug

        allData = [...allData, ...pageData];
        
        const meta = response.data.meta;
        if (meta && meta.currentPage < meta.lastPage) {
          currentPage++;
        } else {
          hasMoreData = false;
        }
      }
      
      return allData;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  };

  const generateNotifications = (products) => {
    const notifications = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Processando notificações...'); // Debug

    products.forEach(product => {
      // Debug
      console.log(`Analisando produto ${product.name}:`, {
        tem_validade: Boolean(product.validate_date),
        tem_alert_days: Boolean(product.alert_days),
        tem_min_stock: Boolean(product.min_stock),
        stock_atual: product.stock
      });

      // Verificar vencimento 
      if (product.validate_date) {
        const expiryDate = product.validate_date;
        let validityDate = createLocalDate(expiryDate);

        if (validityDate && !isNaN(validityDate.getTime())) {
          validityDate.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((validityDate - today) / (1000 * 60 * 60 * 24));

          console.log(`Produto ${product.name}: Data original: ${expiryDate}, Data processada: ${validityDate.toDateString()}, Diferença: ${diffDays} dias`);

          // Produto vencido
          if (diffDays < 0) {
            const notificationId = `expired-${product.id}`;
            if (!isNotificationDeleted(notificationId)) {
              notifications.push({
                id: notificationId,
                type: 'expired',
                title: 'Produto vencido',
                message: `${product.name} venceu há ${Math.abs(diffDays)} dia(s)`,
                date: new Date().toISOString(),
                read: isNotificationRead(notificationId),
                productId: product.id,
                productName: product.name,
                daysExpired: Math.abs(diffDays),
                expiryDate: expiryDate,
                priority: 1
              });
            }
          } 
          // Produto próximo ao vencimento
          else if (diffDays <= 30) // Usar 30 dias como padrão
          {
            const notificationId = `expiry-${product.id}`;
            if (!isNotificationDeleted(notificationId)) {
              notifications.push({
                id: notificationId,
                type: 'expiry',
                title: 'Produto próximo do vencimento',
                message: `${product.name} vence em ${diffDays} dia(s)`,
                date: new Date().toISOString(),
                read: isNotificationRead(notificationId),
                productId: product.id,
                productName: product.name,
                daysUntilExpiry: diffDays,
                expiryDate: expiryDate,
                priority: 2
              });
            }
          }
        }
      }

      // Verificar estoque
      if (product.stock === 0) {
        const notificationId = `outofstock-${product.id}`;
        if (!isNotificationDeleted(notificationId)) {
          notifications.push({
            id: notificationId,
            type: 'outofstock',
            title: 'Produto em falta',
            message: `${product.name} está sem estoque`,
            date: new Date().toISOString(),
            read: isNotificationRead(notificationId),
            productId: product.id,
            productName: product.name,
            currentStock: 0,
            priority: 3
          });
        }
      } else if (product.stock <= 10) { // Usar 10 como estoque mínimo padrão
        const notificationId = `stock-${product.id}`;
        if (!isNotificationDeleted(notificationId)) {
          notifications.push({
            id: notificationId,
            type: 'stock',
            title: 'Estoque baixo',
            message: `${product.name} - Estoque: ${product.stock} unidade(s)`,
            date: new Date().toISOString(),
            read: isNotificationRead(notificationId),
            productId: product.id,
            productName: product.name,
            currentStock: product.stock,
            minStock: 10,
            priority: 4
          });
        }
      }
    });

    console.log(`Total de notificações geradas: ${notifications.length}`); // Debug
    return notifications.sort((a, b) => a.priority - b.priority);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Adicione este useEffect para atualizar o contador quando as notificações mudarem
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (onNotificationsUpdate) {
      onNotificationsUpdate(unreadCount);
    }
  }, [notifications, onNotificationsUpdate]);

  const handleMarkAsRead = (notificationId) => {
    const state = getNotificationState();
    if (!state.readNotifications.includes(notificationId)) {
      state.readNotifications.push(notificationId);
      saveNotificationState(state);
    }

    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === notificationId ? {...notif, read: true} : notif
      )
    );
    
    if (onNotificationsUpdate) {
      onNotificationsUpdate();
    }

    // Adicionar toast
    toast.success('Notificação marcada como lida', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleDelete = (notificationId) => {
    const state = getNotificationState();
    if (!state.deletedNotifications.includes(notificationId)) {
      state.deletedNotifications.push(notificationId);
      saveNotificationState(state);
    }

    setNotifications(prevNotifications => 
      prevNotifications.filter(notif => notif.id !== notificationId)
    );
    
    if (onNotificationsUpdate) {
      onNotificationsUpdate();
    }

    // Adicionar toast
    toast.success('Notificação excluída com sucesso', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleMarkAllAsRead = () => {
    const state = getNotificationState();
    notifications.forEach(notif => {
      if (!state.readNotifications.includes(notif.id)) {
        state.readNotifications.push(notif.id);
      }
    });
    saveNotificationState(state);

    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    
    if (onNotificationsUpdate) {
      onNotificationsUpdate();
    }

    // Adicionar toast
    toast.success(`${notifications.length} notificações marcadas como lidas`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleDeleteAll = () => {
    if (window.confirm('Tem certeza que deseja excluir todas as notificações?')) {
      const state = getNotificationState();
      notifications.forEach(notif => {
        if (!state.deletedNotifications.includes(notif.id)) {
          state.deletedNotifications.push(notif.id);
        }
      });
      saveNotificationState(state);

      const totalDeleted = notifications.length;
      setNotifications([]);
      
      if (onNotificationsUpdate) {
        onNotificationsUpdate();
      }

      // Adicionar toast
      toast.success(`${totalDeleted} notificações excluídas com sucesso`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleHideNotifications = () => {
    if (window.confirm('Tem certeza que deseja esconder todas as notificações? Elas não aparecerão até que você reative manualmente.')) {
      const state = getNotificationState();
      state.hiddenNotifications = true;
      saveNotificationState(state);

      setNotifications([]);
      if (onNotificationsUpdate) {
        onNotificationsUpdate();
      }
    }
  };

  const handleShowNotifications = () => {
    const state = getNotificationState();
    state.hiddenNotifications = false;
    saveNotificationState(state);
    fetchNotifications();
  };

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

  const getNotificationIcon = (notification) => {
    if (notification.type === 'expired') {
      return <FiAlertCircle className="text-red-600" />;
    }
    if (notification.type === 'expiry') {
      return <FiClock className="text-yellow-600" />;
    }
    if (notification.type === 'outofstock') {
      return <FiPackage className="text-red-500" />;
    }
    if (notification.type === 'stock') {
      return <FiPackage className="text-orange-500" />;
    }
    return <FiAlertCircle className="text-blue-500" />;
  };

  const getNotificationColor = (notification) => {
    if (notification.type === 'expired') {
      return notification.read ? 'bg-red-50 border-red-200' : 'bg-red-100 border-red-300';
    }
    if (notification.type === 'expiry') {
      return notification.read ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-100 border-yellow-300';
    }
    if (notification.type === 'outofstock') {
      return notification.read ? 'bg-red-50 border-red-200' : 'bg-red-100 border-red-300';
    }
    if (notification.type === 'stock') {
      return notification.read ? 'bg-orange-50 border-orange-200' : 'bg-orange-100 border-orange-300';
    }
    return notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200';
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;
  const isHidden = areNotificationsHidden();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[85vh] shadow-xl">
        {/* Cabeçalho */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiBell className="text-blue-600" />
            Notificações
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 p-0 bg-white hover:text-gray-700 transition-colors focus:outline-none"
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Lista de Notificações */}
        <div className="overflow-y-auto max-h-[65vh] p-4 scrollbar-hide">
          {/* Botões de ação */}
          <div className='flex justify-end space-x-2 mb-2'>
            {isHidden ? (
              <button
                onClick={handleShowNotifications}
                className="bg-green-600 text-white hover:text-green-100 hover:bg-green-800 text-sm font-medium flex items-center gap-1 focus:outline-none"
                title="Mostrar notificações"
              >
                <FiBell size={14} />
                Mostrar notificações
              </button>
            ) : notifications.length > 0 ? (
              <>
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-white bg-blue-600 hover:bg-blue-800 hover:text-blue-100 text-sm font-medium focus:outline-none"
                  title="Marcar todas como lidas"
                >
                  Marcar todas como lidas
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="text-white bg-red-600 hover:bg-red-700 hover:text-red-100 text-sm font-medium focus:outline-none"
                  title="Excluir todas"
                >
                  Excluir todas
                </button>
                <button
                  onClick={handleHideNotifications}
                  className="text-gray-300 hover:text-gray-400 text-sm font-medium flex items-center gap-1 focus:outline-none"
                  title="Esconder notificações"
                >
                  <FiEyeOff size={14} />
                  Esconder
                </button>
              </>
            ) : null}
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              <span className="ml-3 text-gray-600">Carregando notificações...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">{error}</div>
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
              >
                Tentar novamente
              </button>
            </div>
          ) : isHidden ? (
            <div className="text-center py-12">
              <FiEyeOff className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">Notificações ocultadas</p>
              <p className="text-gray-500 text-sm mt-2">
                As notificações estão temporariamente escondidas. Clique em "Mostrar notificações" para reativá-las.
              </p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getNotificationColor(notification)} transition-all duration-200`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl mt-1 flex-shrink-0">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      <p className={`mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      
                      {/* Informações adicionais */}
                      <div className="mt-2 text-sm text-gray-500">
                        {notification.expiryDate && (
                          <div>Data de validade: {formatDateCorrectly(notification.expiryDate)}</div>
                        )}
                        {notification.currentStock !== undefined && (
                          <div>Estoque atual: {notification.currentStock} unidades</div>
                        )}
                        {notification.daysUntilExpiry && (
                          <div className={`font-medium ${
                            notification.daysUntilExpiry <= 7 
                              ? 'text-red-600' 
                              : notification.daysUntilExpiry <= 15 
                              ? 'text-yellow-500' 
                              : 'text-blue-500'
                          }`}>
                            {notification.daysUntilExpiry <= 7 
                              ? '🚨' 
                              : notification.daysUntilExpiry <= 15 
                              ? '⚠️' 
                              : '📅'
                            } Vence em {notification.daysUntilExpiry} dia{notification.daysUntilExpiry !== 1 ? 's' : ''}
                          </div>
                        )}
                        {notification.daysExpired && (
                          <div className="text-red-600 font-medium">
                            🚨 Vencido há {notification.daysExpired} dia{notification.daysExpired !== 1 ? 's' : ''}
                          </div>
                        )}
                        {/* Mostrar alerta combinado */}
                        {notification.type === 'expiry' && notification.currentStock !== undefined && (
                          <div className="mt-1 p-2 bg-gray-100 rounded text-xs">
                            <strong>Status completo:</strong> Vencimento + Estoque
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">
                          {formatDate(notification.date)}
                        </span>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-green-600 bg-transparent hover:text-green-800 p-0 rounded transition-colors focus:outline-none"
                              title="Marcar como lida"
                            >
                              <FiCheck size={24} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-600 bg-transparent hover:text-red-800 p-0 rounded transition-colors focus:outline-none"
                            title="Excluir"
                          >
                            <FiTrash size={22} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBell className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma notificação no momento</p>
              <p className="text-gray-400 text-sm mt-2">
                As notificações aparecerão aqui quando houver produtos com estoque baixo ou próximos do vencimento
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <strong>Configurações ativas:</strong><br />
                • Alertas 30 dias antes do vencimento<br />
                • Alerta de estoque baixo (≤ 10 unidades)<br />
                • Notificações combinadas para vencimento + estoque<br />
                • Sempre ativo independente das configurações globais
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com informações */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-stone-300 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Total: {notifications.length} notificação{notifications.length !== 1 ? 'ões' : ''}
              </span>
              {unreadCount > 0 && (
                <span className="text-red-600 font-medium">
                  {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};