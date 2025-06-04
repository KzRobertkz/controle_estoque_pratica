import { useState, useEffect } from "react";
import { FiX, FiSearch } from "react-icons/fi";

export const ChooseCategoryModal = ({ 
  isOpen, 
  onClose, 
  categories,
  onCategorySelect,
  selectedCategoryId = ""
}) => {
    const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategoryId);
    const [isSearchingCategory, setIsSearchingCategory] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    
    // Reset estados quando o modal abrir
    useEffect(() => {
        if (isOpen) {
            setLocalSelectedCategory(selectedCategoryId);
            setIsSearchingCategory(false);
            setCategorySearch('');
        }
    }, [selectedCategoryId, isOpen]);
    
    if (!isOpen) return null;

    // Filtra as categorias baseado na pesquisa
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Alterna modo de pesquisa
    const toggleCategorySearch = () => {
        setIsSearchingCategory(!isSearchingCategory);
        setCategorySearch('');
    };

    const handleConfirm = () => {
        onCategorySelect(localSelectedCategory);
        onClose();
    };

    const handleCancel = () => {
        setLocalSelectedCategory(selectedCategoryId);
        setIsSearchingCategory(false);
        setCategorySearch('');
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        Escolha uma Categoria
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 p-0 bg-white hover:text-gray-700 transition-colors focus:outline-none"
                    >
                        <FiX size={28} />
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                    </label>
                    {isSearchingCategory ? (
                        <div className="relative">
                            <input
                                type="text"
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                                className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Pesquisar categoria..."
                            />
                            <button
                                type="button"
                                onClick={toggleCategorySearch}
                                className="absolute right-1 px-3 py-1 bg-cinza-escuro top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
                            >
                                <FiX size={25} />
                            </button>

                            {categorySearch && filteredCategories.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-cinza-escuro border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-hide">
                                    {filteredCategories.map((category) => (
                                        <button
                                            type="button"
                                            key={category.id}
                                            onClick={() => {
                                                setLocalSelectedCategory(category.id.toString());
                                                setIsSearchingCategory(false);
                                                setCategorySearch('');
                                            }}
                                            className="block w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-700 focus:outline-none"
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                value={localSelectedCategory}
                                onChange={(e) => setLocalSelectedCategory(e.target.value)}
                                className="mt-1 block w-full rounded-md bg-cinza-escuro border border-gray-300 p-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option className='font-medium' value="">Selecione uma categoria</option>
                                {categories.map((category) => (
                                    <option className='font-medium' key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={toggleCategorySearch}
                                className="absolute right-1 px-3 py-1 top-1/2 bg-cinza-escuro -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
                            >
                                <FiSearch size={25} />
                            </button>
                        </div>
                    )}
                    
                    {/* Descrição da categoria */}
                    {localSelectedCategory && (
                        <div className="mt-2 p-2 bg-cinza-escuro rounded text-sm text-gray-400">
                            {categories.find(cat => cat.id === parseInt(localSelectedCategory))?.description || 'Sem descrição'}
                        </div>
                    )}
                </div>

                {/* Botões */}
                <div className="flex justify-end mt-32 space-x-3">
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
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            !localSelectedCategory 
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-700'
                        }`}
                        disabled={!localSelectedCategory}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};