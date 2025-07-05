'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [carregando, setCarregando] = useState(false);

    const abrirCatalogo = async () => {
        const usernameClean = username.trim().toLowerCase(); // Padronizar
        
        if (usernameClean) {
            setCarregando(true);
            try {
                router.push(`/${usernameClean}`);
            } catch (error) {
                console.error('Erro na navegação:', error);
                setCarregando(false);
            }
        } else {
            alert('Digite um nome de usuário para ver o catálogo');
        }
    };

    // Permitir pressionar Enter para navegar
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            abrirCatalogo();
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 min-h-screen flex flex-col justify-center gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Bem-vindo ao Catálogo Digital
                </h1>
                <p className="text-gray-600 mb-6">
                    Digite o nome de usuário para visualizar o catálogo de produtos
                </p>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Nome do usuário (ex: joao, maria)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={carregando}
                />

                <button
                    onClick={abrirCatalogo}
                    disabled={carregando || !username.trim()}
                    className="bg-blue-600 text-white py-3 rounded-lg font-semibold w-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                    {carregando ? 'Carregando...' : 'Entrar no Catálogo'}
                </button>
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">
                    Não tem conta ainda?
                </p>
                <button
                    onClick={() => router.push('/register')}
                    className="text-blue-600 hover:underline font-medium"
                >
                    Criar conta e adicionar produtos
                </button>
            </div>

            <div className="text-center">
                <button
                    onClick={() => router.push('/login')}
                    className="text-gray-600 hover:underline text-sm"
                >
                    Já tem conta? Fazer login
                </button>
            </div>
        </div>
    );
}