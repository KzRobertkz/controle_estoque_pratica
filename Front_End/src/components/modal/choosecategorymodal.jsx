import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export const ChooseCategoryModal = ({ 
  isOpen, 
  onClose, 
  categories,
  onCategorySelect,
  selectedCategoryId = ""
}) => {
    const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategoryId);
    
    // CORREÇÃO: Atualizar o estado local quando selectedCategoryId mudar
    useEffect(() => {
        if (isOpen) {
            console.log("Modal aberto com selectedCategoryId:", selectedCategoryId); // Debug
            setLocalSelectedCategory(selectedCategoryId);
        }
    }, [selectedCategoryId, isOpen]);
    
    if (!isOpen) return null;

    const handleConfirm = () => {
        console.log("Confirmando categoria:", localSelectedCategory); // Debug
        onCategorySelect(localSelectedCategory);
        onClose();
    };

    const handleCancel = () => {
        setLocalSelectedCategory(selectedCategoryId); // Reset para o valor original
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        Escolha uma Categoria
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                    </label>
                    <select
                        value={localSelectedCategory}
                        onChange={(e) => {
                            console.log("Categoria selecionada no modal:", e.target.value); // Debug
                            setLocalSelectedCategory(e.target.value);
                        }}
                        className="mt-1 text-gray-700 block w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option className='font-medium text-gray-400' value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option className='font-medium' key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    
                    {/* Mostrar descrição da categoria selecionada */}
                    {localSelectedCategory && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                            {categories.find(cat => cat.id === parseInt(localSelectedCategory))?.description || 'Sem descrição'}
                        </div>
                    )}
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        disabled={!localSelectedCategory}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};