'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    // Redireciona se já estiver logado
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/cadastro');
            }
        });
        return unsubscribe;
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email || !password) {
            setErro('Preencha todos os campos');
            return;
        }

        setCarregando(true);
        setErro('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/cadastro');
        } catch (error) {
            console.error('Erro no login:', error);
            setErro('Email ou senha incorretos');
        } finally {
            setCarregando(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const form = e.currentTarget.closest('form');
            if (form) {
                form.requestSubmit();
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 min-h-screen flex flex-col justify-center">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta</h1>
                <p className="text-gray-600">
                    Acesse sua conta e gerencie seus produtos
                </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="seu@email.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={carregando}
                        required
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Sua senha"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={carregando}
                        required
                    />
                </div>

                {/* Erro */}
                {erro && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        <div className="flex items-center">
                            <span className="mr-2">⚠️</span>
                            {erro}
                        </div>
                    </div>
                )}

                {/* Botão de login */}
                <button
                    type="submit"
                    disabled={carregando || !email || !password}
                    className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    {carregando ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Entrando...
                        </>
                    ) : (
                        'Entrar na minha conta'
                    )}
                </button>
            </form>

            {/* Links de navegação */}
            <div className="text-center mt-8 space-y-4">
                <p className="text-gray-600">
                    Ainda não tem uma conta?
                </p>
                <button
                    onClick={() => router.push('/register')}
                    className="text-blue-600 hover:underline font-medium"
                >
                    Criar conta gratuita
                </button>

                <div className="pt-4">
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-500 hover:underline text-sm"
                    >
                        ← Voltar à página inicial
                    </button>
                </div>
            </div>

            {/* Informações de segurança */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-center text-blue-800">
                    <span className="mr-2">🔒</span>
                    <span className="text-sm">
                        Seus dados estão protegidos com criptografia de ponta a ponta
                    </span>
                </div>
            </div>
        </div>
    );
}