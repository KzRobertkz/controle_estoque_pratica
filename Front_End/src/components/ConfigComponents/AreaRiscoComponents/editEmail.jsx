import { useState } from 'react';
import { EmailModal } from "../../modal/ConfigModals";

export const EditEmailComponent = () => {
    // Estados para o modal
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    
    // Estados de loading
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estados dos formulários
    const [newEmail, setNewEmail] = useState('');

    // Handler do modal de email
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3333/auth/update-email', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ email: newEmail }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 400 && data.errors) {
                    throw new Error(data.errors.email?.[0] || data.message || 'Email inválido');
                } else if (data.message?.includes('já está em uso') || data.message?.includes('already')) {
                    throw new Error('Este email já está em uso por outro usuário');
                } else {
                    throw new Error(data?.message || 'Erro ao alterar email');
                }
            }

            // Limpa campo e fecha o modal
            setNewEmail('');
            setIsEmailModalOpen(false);

            alert('Email alterado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao alterar email:', error.message);
            alert(`Erro: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {/* Botão para abrir modal de email */}
            <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                <button 
                    className="text-sm p-2 font-medium focus:outline-none hover:bg-zinc-700 hover:text-gray-200 rounded-md transition-colors"
                    onClick={() => setIsEmailModalOpen(true)}
                >
                    Editar E-mail
                </button>
                <p className="text-base text-stone-800 mt-2">
                    Editar o endereço de E-mail
                </p>
            </div>

            {/* Modal de alteração de email */}
            <EmailModal 
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                onSubmit={handleEmailSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};