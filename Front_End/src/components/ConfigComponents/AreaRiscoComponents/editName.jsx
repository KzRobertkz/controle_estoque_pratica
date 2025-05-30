import { useState } from 'react';
import { NameModal } from "../../modal/ConfigModals";

export const EditNameComponent = () => {
    // Estados para o modal
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    
    // Estados de loading
    const [isSubmitName, setIsSubmitName] = useState(false);
    
    // Estados dos formulários
    const [newName, setNewName] = useState('');

    // Handler do modal de nome
    const handleNameSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitName(true);
        
        try {
            const response = await fetch('http://localhost:3333/auth/update-name', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: newName }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400 && data.errors) {
                    throw new Error(data.errors.name?.[0] || data.message || 'Nome inválido');
                } else {
                    throw new Error(data?.message || 'Erro ao alterar nome');
                }
            }

            // Limpa campo e fecha o modal
            setNewName('');
            setIsNameModalOpen(false);

            alert('Nome alterado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao alterar nome:', error.message);
            alert(`Erro: ${error.message}`);
        } finally {
            setIsSubmitName(false);
        }
    };

    return (
        <div>
            {/* Botão para abrir modal de nome */}
            <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                <button 
                    className="text-sm p-2 font-medium focus:outline-none hover:bg-zinc-700 hover:text-gray-200 rounded-md transition-colors"
                    onClick={() => setIsNameModalOpen(true)}
                >
                    Editar Nome Completo
                </button>
                <p className="text-base text-stone-800 mt-2">
                    Editar o nome completo
                </p>
            </div>

            {/* Modal de alteração de nome */}
            <NameModal 
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                currentName={''}
                newName={newName}
                setNewName={setNewName}
                onSubmit={handleNameSubmit}
                isSubmitName={isSubmitName}
            />
        </div>
    );
};