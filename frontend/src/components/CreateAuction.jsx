import React, { useState, useRef } from 'react';
import { getContract, parseEther } from '../utils/contractConfig';
import { Upload } from 'lucide-react';

const CreateAuction = ({ signer, onAuctionCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        startingPrice: '',
        duration: '3600'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            
            // URL muito curta para o blockchain
            setFormData(prev => ({
                ...prev,
                imageUrl: "https://bit.ly/3Gp7HWx"
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
    
        try {
            if (!formData.title || !formData.description || !formData.startingPrice) {
                throw new Error('Por favor, preencha todos os campos');
            }
    
            const contract = getContract(signer);
            
            // Garantir que estamos usando uma URL curta
            const imageUrl = "https://bit.ly/3Gp7HWx";
            
            console.log('Enviando dados:', {
                title: formData.title,
                description: formData.description,
                imageUrl: imageUrl,
                startingPrice: formData.startingPrice,
                duration: formData.duration
            });
    
            const tx = await contract.createAuction(
                formData.title,
                formData.description,
                imageUrl,
                parseEther(formData.startingPrice),
                formData.duration,
                { gasLimit: 500000 }
            );
    
            await tx.wait();
            
            if (onAuctionCreated) {
                onAuctionCreated();
            }
        } catch (err) {
            console.error('Erro ao criar leilão:', err);
            setError('Erro ao criar leilão. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-gray-800 border-gray-700 rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Criar Novo Leilão</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">
                                Imagem do Item
                            </label>
                            <div
                                onClick={handleImageClick}
                                className="relative flex flex-col items-center justify-center w-full h-48 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-purple-500"
                            >
                                {previewImage ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-contain rounded-md"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white">Alterar imagem</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="font-medium text-gray-400">
                                            Clique para selecionar uma imagem
                                        </span>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Título</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Descrição</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Preço Inicial (ETH)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="startingPrice"
                                value={formData.startingPrice}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Duração</label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="3600">1 hora</option>
                                <option value="7200">2 horas</option>
                                <option value="86400">1 dia</option>
                                <option value="172800">2 dias</option>
                                <option value="604800">1 semana</option>
                            </select>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Criando...' : 'Criar Leilão'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAuction;