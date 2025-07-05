'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const login = async () => {
        if (!email.trim() || !senha.trim()) {
            setErro('Preencha todos os campos');
            return;
        }

        setCarregando(true);
        setErro('');

        try {
            await signInWithEmailAndPassword(auth, email.trim(), senha);
            router.push('/cadastro');
        } catch (e: any) {
            console.error('Erro no login:', e);
            
            // Tratar diferentes tipos de erro
            switch (e.code) {
                case 'auth/user-not-found':
                    setErro('Usuário não encontrado');
                    break;
                case 'auth/wrong-password':
                    setErro('Senha incorreta');
                    break;
                case 'auth/invalid-email':
                    setErro('Email inválido');
                    break;
                case 'auth/too-many-requests':
                    setErro('Muitas tentativas. Tente novamente mais tarde');
                    break;
                default:
                    setErro('Email ou senha inválidos');
            }
        } finally {
            setCarregando(false);
        }
    };

    // Permitir login com Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center">
            <div className="border rounded-lg p-6 shadow-sm bg-white">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Entrar na Conta</h1>
                    <p className="text-gray-600">Acesse sua conta para gerenciar produtos</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={carregando}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={carregando}
                        />
                    </div>

                    {erro && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
                            ⚠️ {erro}
                        </div>
                    )}

                    <button 
                        onClick={login} 
                        disabled={carregando || !email.trim() || !senha.trim()}
                        className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>

                <hr className="my-6" />

                <div className="text-center space-y-3">
                    <p className="text-gray-600">
                        Não tem conta ainda?
                    </p>
                    <button
                        onClick={() => router.push('/register')}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Criar conta grátis
                    </button>
                </div>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={() => router.push('/')}
                    className="text-gray-500 hover:underline text-sm"
                >
                    ← Voltar à página inicial
                </button>
            </div>
        </div>
    );
}