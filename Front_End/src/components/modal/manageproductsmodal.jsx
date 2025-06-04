import { useState } from 'react';
import { FiX, FiSettings, FiSave, FiBell, FiClock } from 'react-icons/fi';

export const ManageProductsModal = ({ isOpen, onClose, product, onSave }) => {
  const [settings, setSettings] = useState({
    minStock: product?.minStock || 0,
    notifyLowStock: product?.notifyLowStock || false,
    expiryDate: product?.expiryDate || '',
    notifyBeforeExpiry: product?.notifyBeforeExpiry || false,
    daysBeforeExpiryNotification: product?.daysBeforeExpiryNotification || 30,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] shadow-xl">
        {/* Cabeçalho */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiSettings className="text-gray-800" />
            Gerenciar Configurações do Produto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Formulário */}
        <div className="p-6 space-y-6">
          {/* Configurações de Estoque */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
              <FiBell />
              Alertas de Estoque
            </h3>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notifyLowStock}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifyLowStock: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-gray-700">Notificar estoque baixo</span>
              </label>

              <input
                type="number"
                value={settings.minStock}
                onChange={(e) => setSettings({
                  ...settings,
                  minStock: e.target.value
                })}
                min="0"
                className="w-24 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo"
              />
            </div>
          </div>

          {/* Configurações de Validade */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
              <FiClock />
              Controle de Validade
            </h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecionar produto
                </label>
                <input
                  type="text"
                  value={settings.expiryDate}
                  onChange={(e) => setSettings({
                    ...settings,
                    expiryDate: e.target.value
                  })}
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade
                </label>
                <input
                  type="date"
                  value={settings.expiryDate}
                  onChange={(e) => setSettings({
                    ...settings,
                    expiryDate: e.target.value
                  })}
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifyBeforeExpiry}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifyBeforeExpiry: e.target.checked
                    })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="text-gray-700">Notificar antes do vencimento</span>
                </label>

                <input
                  type="number"
                  value={settings.daysBeforeExpiryNotification}
                  onChange={(e) => setSettings({
                    ...settings,
                    daysBeforeExpiryNotification: e.target.value
                  })}
                  min="1"
                  className="w-24 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dias"
                />
                <span className="text-gray-600">dias antes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};
