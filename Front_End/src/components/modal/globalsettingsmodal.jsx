import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

export function GlobalSettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    defaultMinStock: null,
    daysBeforeExpiryNotification: null,
    notifyLowStock: null,
    notifyBeforeExpiry: null,
    enableEmailNotifications: null
  });

  const [initialSettings, setInitialSettings] = useState(null);

  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/settings');
      if (response.data) {
        setSettings(response.data);
        setInitialSettings(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Não foi possível carregar as configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await api.put('/settings', settings);
      if (response.status === 200) {
        toast.success('Configurações salvas com sucesso!');
        onClose(); // Fecha o modal após salvar com sucesso
        return; // Retorna para evitar execução adicional
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const hasChanges = () => {
    if (!initialSettings) return false;
    
    return Object.keys(settings).some(key => {
      const initial = initialSettings[key] ?? null;
      const current = settings[key] ?? null;
      return initial !== current;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Configurações Globais do Estoque</h2>
          <button
            onClick={onClose}
            className="text-gray-500 bg-white p-0 hover:text-gray-700 focus:outline-none"
          >
            <FiX className='text-3xl'/>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Configurações de Estoque */}
            <div className="bg-gray-50 p-6 rounded-xl border border-stone-300 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Configurações de Estoque</h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="defaultMinStock" className="text-gray-700 text-sm font-medium">
                    Estoque mínimo padrão:
                  </label>
                  <input
                    id="defaultMinStock"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={settings.defaultMinStock ?? ''}
                    disabled={!settings.notifyLowStock}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleInputChange('defaultMinStock', value === '' ? null : Number(value));
                      }
                    }}
                    className={`w-20 px-3 py-2 rounded-md border text-center shadow-sm transition-all duration-150
                      ${
                        settings.notifyLowStock
                          ? 'bg-cinza-escuro text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-gray-200 border-gray-400 text-gray-700 cursor-not-allowed'
                      }`}
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-center space-x-3">
                  <input
                    id="notifyLowStock"
                    type="checkbox"
                    checked={settings.notifyLowStock ?? false}
                    onChange={(e) => handleInputChange('notifyLowStock', e.target.checked)}
                    className="h-5 w-5 text-indigo-600 focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-all duration-150"
                  />
                  <label htmlFor="notifyLowStock" className="text-gray-700 text-sm font-medium cursor-pointer">
                    Ativar alertas de estoque baixo
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Validade */}
            <div className="bg-gray-50 p-6 rounded-xl border border-stone-300 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Configurações de Validade</h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="daysBeforeExpiryNotification" className="text-gray-700 text-sm font-medium">
                    Dias para notificação de vencimento:
                  </label>
                  <input
                    id="daysBeforeExpiryNotification"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Digite um valor"
                    value={settings.daysBeforeExpiryNotification ?? ''}
                    disabled={!settings.notifyBeforeExpiry}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleInputChange('daysBeforeExpiryNotification', value === '' ? null : Number(value));
                      }
                    }}
                    className={`w-20 px-3 py-2 rounded-md border text-center shadow-sm transition-all duration-150
                      ${
                        settings.notifyBeforeExpiry
                          ? 'bg-cinza-escuro text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-gray-200 border-gray-400 text-gray-700 cursor-not-allowed'
                      }`}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    id="notifyBeforeExpiry"
                    type="checkbox"
                    checked={settings.notifyBeforeExpiry ?? false}
                    onChange={(e) => handleInputChange('notifyBeforeExpiry', e.target.checked)}
                    className="h-5 w-5 text-indigo-600 focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-all duration-150"
                  />
                  <label htmlFor="notifyBeforeExpiry" className="text-gray-700 text-sm font-medium cursor-pointer">
                    Ativar alertas de vencimento
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Notificações */}
            <div className="bg-gray-50 p-6 rounded-xl border border-stone-300 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Configurações de Notificações ⭐BETA</h3>

              <div className="flex items-center space-x-3">
                <input
                  id="enableEmailNotifications"
                  type="checkbox"
                  checked={settings.enableEmailNotifications ?? false}
                  onChange={(e) => handleInputChange('enableEmailNotifications', e.target.checked)}
                  className="h-5 w-5 text-indigo-600 focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-all duration-150"
                />
                <label htmlFor="enableEmailNotifications" className="text-gray-700 text-sm font-medium cursor-pointer">
                  Ativar notificações por e-mail
                </label>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={loading || !hasChanges()}
                className={`px-6 py-2 rounded-md transition-colors ${
                  !hasChanges() 
                    ? 'bg-blue-300 text-gray-100 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
