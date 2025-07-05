'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [username, setUsername] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [telefone, setTelefone] = useState('');

  const verificarUsername = async (username: string): Promise<boolean> => {
    const usernameQuery = query(
      collection(db, 'usuarios'),
      where('username', '==', username.toLowerCase())
    );
    const snapshot = await getDocs(usernameQuery);
    return !snapshot.empty;
  };

  const registrar = async (): Promise<void> => {
    if (!username.trim() || !email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    const usernameClean = username.trim().toLowerCase();

    if (telefone && telefone.length < 10) {
      setErro('Telefone inválido. Use DDD + número.');
      return;
    }

    if (usernameClean.length < 3) {
      setErro('Username deve ter pelo menos 3 caracteres');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(usernameClean)) {
      setErro('Username pode conter apenas letras, números e _');
      return;
    }

    if (senha.length < 6) {
      setErro('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const usernameExiste = await verificarUsername(usernameClean);
      if (usernameExiste) {
        setErro('Username já está em uso. Escolha outro.');
        setCarregando(false);
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      const uid = cred.user.uid;

      await setDoc(doc(db, 'usuarios', uid), {
        email: email.trim(),
        username: usernameClean,
        telefone: telefone.trim(),
        criadoEm: new Date(),
      });

      router.push('/cadastro');

    } catch (error) {
      console.error('Erro no registro:', error);

      if (error instanceof FirebaseError || (error as AuthError)?.code) {
        const firebaseError = error as AuthError;

        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setErro('Este email já está em uso');
            break;
          case 'auth/invalid-email':
            setErro('Email inválido');
            break;
          case 'auth/weak-password':
            setErro('Senha muito fraca. Use pelo menos 6 caracteres');
            break;
          case 'auth/operation-not-allowed':
            setErro('Registro não permitido. Contate o suporte');
            break;
          default:
            setErro('Erro ao criar conta. Tente novamente');
        }
      } else {
        setErro('Erro inesperado. Tente novamente');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      registrar();
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(value);
  };

  return (
    <div className="max-w-md mx-auto p-8 min-h-screen flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Criar Conta</h1>
        <p className="text-gray-600">
          Junte-se a milhares de vendedores e crie seu catálogo digital gratuitamente
        </p>
      </div>

      {/* Formulário */}
      <div className="space-y-6">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome de usuário *
          </label>
          <input
            type="text"
            placeholder="ex: maria_store, joao_vendas"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)
                ? 'focus:ring-blue-500 border-blue-300 bg-blue-50'
                : 'focus:ring-blue-500 border-gray-300'
            }`}
            value={username}
            onChange={handleUsernameChange}
            onKeyPress={handleKeyPress}
            disabled={carregando}
            maxLength={20}
          />
          
          {/* Validação visual em tempo real */}
          {username && (
            <div className="mt-2 text-sm">
              {username.length < 3 ? (
                <p className="text-red-500 flex items-center">
                  <span className="mr-1">❌</span> Mínimo 3 caracteres
                </p>
              ) : (
                <p className="text-green-600 flex items-center">
                  <span className="mr-1">✅</span> Username válido
                </p>
              )}
            </div>
          )}

          {/* Preview do link */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <p className="text-xs text-blue-600 mb-1">
              🔗 Seu catálogo será acessível em:
            </p>
            <p className="font-mono text-sm text-blue-800 font-medium">
              catalogo.com/{username || 'seu_usuario'}
            </p>
          </div>
        </div>

        {/* Telefone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp (opcional)
          </label>
          <input
            type="tel"
            placeholder="11999999999"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
            onKeyPress={handleKeyPress}
            disabled={carregando}
          />
          <p className="text-xs text-gray-500 mt-1">
            Clientes poderão entrar em contato diretamente
          </p>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={carregando}
          />
        </div>

        {/* Senha Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha *
          </label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              senha.length >= 6
                ? 'focus:ring-blue-500 border-green-300 bg-green-50'
                : 'focus:ring-blue-500 border-gray-300'
            }`}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={carregando}
          />
          
          {/* Validação visual da senha */}
          {senha && (
            <div className="mt-2 text-sm">
              {senha.length < 6 ? (
                <p className="text-red-500 flex items-center">
                  <span className="mr-1">❌</span> Mínimo 6 caracteres
                </p>
              ) : (
                <p className="text-green-600 flex items-center">
                  <span className="mr-1">✅</span> Senha segura
                </p>
              )}
            </div>
          )}
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

        {/* Botão de registro */}
        <button
          onClick={registrar}
          disabled={carregando || !username.trim() || !email.trim() || !senha.trim()}
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {carregando ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando conta...
            </>
          ) : (
            'Criar Conta Gratuita'
          )}
        </button>

        {/* Benefícios */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">🎉 O que você ganha:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Catálogo online profissional</li>
            <li>• Link personalizado para compartilhar</li>
            <li>• Integração direta com WhatsApp</li>
            <li>• 100% gratuito e sem limites</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 space-y-4">
        <p className="text-gray-600">
          Já tem uma conta?
        </p>
        <button
          onClick={() => router.push('/login')}
          className="text-blue-600 hover:underline font-medium"
        >
          Fazer login
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
    </div>
  );
}