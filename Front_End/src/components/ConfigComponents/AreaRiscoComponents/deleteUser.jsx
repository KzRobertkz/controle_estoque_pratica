import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { DeleteUserModal } from "../../modal/ConfigModals";

export const DeleteUserComponent = () => {
    // Estados para o modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Estados de loading
    const [isDeleting, setIsDeleting] = useState(false);

    // Handler para excluir usuário
    const handleDeleteUser = async (password) => {
        setIsDeleting(true);
        
        try {
            const response = await fetch('http://localhost:3333/auth/delete-user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao excluir usuário');
            }

            localStorage.removeItem('token');
            window.location.href = '/login';
            
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            
            if (error.message && error.message.includes('404')) {
                throw new Error(
                    'Rota de exclusão não encontrada. Verifique se a rota foi configurada no backend.'
                );
            }
            
            throw error;
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            {/* Botão para abrir modal de exclusão */}
            <div className="bg-white rounded-lg p-6 border border-red-400 w-full hover:bg-red-100 transition-colors duration-200">
                <button 
                    className="text-sm bg-red-500 text-white p-2 font-medium hover:bg-red-700 transition-colors rounded-md flex items-center gap-2 focus:outline-none"
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    <FiTrash2 className="text-white" />
                    Excluir Usuário
                </button>
                <p className="text-base text-stone-800 mt-2">
                    Excluir usuário por completo
                </p>
            </div>

            {/* Modal de confirmação de exclusão */}
            <DeleteUserModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteUser}
                isLoading={isDeleting}
            />
        </div>
    );
};