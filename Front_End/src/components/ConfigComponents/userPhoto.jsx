import { useState, useEffect } from "react";

export const UserPhotoComponent = () => {
    const [fileName, setFileName] = useState('');
    const [user, setUser] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Busca os dados do usuário ao carregar o componente
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await fetch("http://localhost:3333/me", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUser(data.user);
                        // Carrega a foto atual do localStorage
                        const savedPhoto = localStorage.getItem(`userPhoto_${data.user.id}`);
                        if (savedPhoto) {
                            setCurrentPhoto(savedPhoto);
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar os dados do usuário", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleFileChange = async (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);
            setIsUploading(true);

            // Validação do arquivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                setIsUploading(false);
                return;
            }

            // Validação do tamanho (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB.');
                setIsUploading(false);
                return;
            }

            try {
                // Converte a imagem para base64
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    
                    // Salva a imagem no localStorage usando o ID do usuário
                    if (user?.id) {
                        localStorage.setItem(`userPhoto_${user.id}`, base64Image);
                        setCurrentPhoto(base64Image);
                        setHasChanges(true);
                    }
                    
                    setIsUploading(false);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Erro ao processar a imagem:', error);
                alert('Erro ao processar a imagem. Tente novamente.');
                setIsUploading(false);
            }
        }
    };

    const handleRemovePhoto = () => {
        if (user?.id) {
            localStorage.removeItem(`userPhoto_${user.id}`);
            setCurrentPhoto(null);
            setFileName('');
            // Recarrega a página imediatamente após remover
            window.location.reload();
        }
    };

    const handleApplyChanges = () => {
        setHasChanges(false);
        window.location.reload();
    };

    return (
        <div className="bg-white rounded-lg p-6 border border-stone-200 w-full">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-stone-700 font-medium">
                        Alterar Foto do Usuário
                    </p>
                    <p className="text-base text-stone-500">
                        Altera foto do usuário no cabeçalho da página
                    </p>
                    
                    {/* Preview da foto atual */}
                    {currentPhoto && (
                        <div className="mt-4 flex items-center gap-4">
                            <img 
                                src={currentPhoto} 
                                alt="Foto atual do usuário" 
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                            />
                            <div>
                                <p className="text-sm text-stone-700">Foto atual</p>
                                <div className="flex gap-3 mt-1">
                                    <button
                                        onClick={handleRemovePhoto}
                                        className="text-sm text-white bg-red-500 hover:bg-red-700 focus:outline-none"
                                    >
                                        Remover foto
                                    </button>
                                    {hasChanges && (
                                        <button
                                            onClick={handleApplyChanges}
                                            className="text-sm focus:outline-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                                        >
                                            Aplicar alterações
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="mx-2 mt-6 w-full">
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="file-upload"
                            className={`flex h-11 w-full cursor-pointer items-center justify-center rounded-lg px-4 text-base font-medium text-white transition-colors duration-300 focus:outline-none ${
                                isUploading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-800'
                            }`}
                        >
                            {isUploading ? 'Processando...' : 'Escolher Foto'}
                        </label>
                        
                        {fileName && (
                            <p className="flex justify-center mt-2 text-base text-blue-800">
                                {fileName}
                            </p>
                        )}
                        
                        <p className="text-xs text-stone-500 mt-2 text-center">
                            Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                        </p>
                    </div>
                </div>           
            </div>
        </div>
    );
};