'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

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

    // ✅ CORRIGIDO: Tipagem adequada para evento de formulário
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h1 className="text-3xl font-bold text-center text-gray-900">
                        Entrar
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{' '}
                        <Link href="/register" className="text-blue-600 hover:text-blue-500">
                            criar uma nova conta
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {erro && (
                        <div className="text-red-600 text-sm text-center">
                            {erro}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={carregando}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {carregando ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm">
                            ← Voltar para página inicial
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}