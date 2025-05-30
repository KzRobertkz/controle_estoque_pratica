import { useState } from 'react';
import { PasswordModal } from "../../modal/ConfigModals";

export const EditPasswordComponent = () => {
    // Estados para o modal
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    // Estados de loading
    const [isSubmitPassword, setIsSubmitPassword] = useState(false);
    
    // Estados dos formulários
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Handler do modal de senha
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        // Validação no frontend
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        if (newPassword.length < 8) {
            alert('A nova senha deve ter pelo menos 8 caracteres');
            return;
        }

        setIsSubmitPassword(true);

        try {
            const response = await fetch('http://localhost:3333/auth/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ 
                    currentPassword, 
                    newPassword 
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 400 && data.errors) {
                    const errorMessage = data.errors.currentPassword?.[0] || 
                                        data.errors.newPassword?.[0] || 
                                        data.message || 'Dados inválidos';
                    throw new Error(errorMessage);
                } else {
                    throw new Error(data?.message || 'Erro ao alterar senha');
                }
            }

            // Limpa campos e fecha o modal
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsPasswordModalOpen(false);

            alert('Senha alterada com sucesso!');
            
        } catch (error) {
            console.error('Erro ao alterar senha:', error.message);
            alert(`Erro: ${error.message}`);
        } finally {
            setIsSubmitPassword(false);
        }
    };

    return (
        <div>
            {/* Botão para abrir modal de senha */}
            <div className="bg-white rounded-lg p-6 border border-red-200 w-full hover:bg-red-100 transition-colors duration-200">
                <button 
                    className="text-sm p-2 font-medium focus:outline-none hover:bg-zinc-700 hover:text-gray-200 rounded-md transition-colors"
                    onClick={() => setIsPasswordModalOpen(true)}
                >
                    Editar senha
                </button>
                <p className="text-base text-stone-800 mt-2">
                    Definir uma nova senha
                </p>
            </div>

            {/* Modal de alteração de senha */}
            <PasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onSubmit={handlePasswordSubmit}
                isSubmitPassword={isSubmitPassword}
            />
        </div>
    );
};
