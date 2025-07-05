'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [carregando, setCarregando] = useState(false);

    const abrirCatalogo = async () => {
        const usernameClean = username.trim().toLowerCase();
        
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            abrirCatalogo();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-blue-100 rounded-full p-6 mb-6">
                        <span className="text-5xl">🛍️</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Catálogo Digital
                        <span className="block text-blue-600">Gratuito</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Crie seu catálogo online em minutos e comece a vender para todo o Brasil
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✅</span>
                            100% Gratuito
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✅</span>
                            Sem Mensalidades
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-500 mr-2">✅</span>
                            Integração WhatsApp
                        </div>
                    </div>
                </div>

                {/* Buscar Catálogo */}
                <div className="max-w-md mx-auto mb-16">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                            Buscar Catálogo
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do usuário
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: maria_store, joao_vendas"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-lg"
                                    disabled={carregando}
                                />
                                {username && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        🔗 Buscando: <span className="font-mono">catalogo.com/{username.toLowerCase()}</span>
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={abrirCatalogo}
                                disabled={carregando || !username.trim()}
                                className="bg-blue-600 text-white py-4 rounded-xl font-bold w-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {carregando ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Carregando...
                                    </div>
                                ) : (
                                    '🔍 Abrir Catálogo'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ações principais */}
                <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto mb-16">
                    <button
                        onClick={() => router.push('/register')}
                        className="bg-green-600 text-white py-6 px-8 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <div className="text-3xl mb-2">✨</div>
                        <div className="text-lg">Criar Catálogo Gratuito</div>
                        <div className="text-sm opacity-90">Comece agora em 2 minutos</div>
                    </button>

                    <button
                        onClick={() => router.push('/login')}
                        className="bg-white text-gray-700 border-2 border-gray-300 py-6 px-8 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <div className="text-3xl mb-2">👤</div>
                        <div className="text-lg">Entrar na Conta</div>
                        <div className="text-sm opacity-70">Gerenciar produtos</div>
                    </button>
                </div>

                {/* Benefícios */}
                <div className="grid gap-8 md:grid-cols-3 mb-16">
                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                            Rápido e Fácil
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Crie seu catálogo em minutos. Apenas algumas informações básicas e pronto!
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
                        <div className="text-4xl mb-4">💰</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                            Totalmente Gratuito
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Sem taxas, sem mensalidades, sem pegadinhas. Use quantas vezes quiser.
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
                        <div className="text-4xl mb-4">📱</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                            WhatsApp Integrado
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Clientes entram em contato direto com você pelo WhatsApp com um clique.
                        </p>
                    </div>
                </div>

       
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-16">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        ⭐ O que nossos usuários dizem
                    </h2>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-blue-50 rounded-xl p-6">
                            <div className="flex items-center mb-3">
                                <div className="bg-blue-100 rounded-full p-2 mr-3">
                                    <span className="text-lg">👩‍💼</span>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Maria Silva</div>
                                    <div className="text-sm text-gray-600">Vendedora de doces</div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                Aumentei minhas vendas em 200% desde que criei meu catálogo. Super fácil de usar!
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-6">
                            <div className="flex items-center mb-3">
                                <div className="bg-green-100 rounded-full p-2 mr-3">
                                    <span className="text-lg">👨‍💻</span>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">João Santos</div>
                                    <div className="text-sm text-gray-600">Loja de roupas</div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                Meus clientes adoraram poder ver todos os produtos em um só lugar. Recomendo!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Pronto para começar a vender mais?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Junte-se a milhares de vendedores que já usam nossa plataforma
                    </p>
                    
                    <button
                        onClick={() => router.push('/register')}
                        className="bg-white text-blue-600 py-4 px-8 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        🚀 Criar Meu Catálogo Agora
                    </button>
                    
                    <p className="text-sm mt-4 opacity-75">
                        ⏱️ Leva apenas 2 minutos para configurar
                    </p>
                </div>
            </div>
        </div>
    );
}