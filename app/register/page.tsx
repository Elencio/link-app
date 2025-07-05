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

  // ✅ VALIDAÇÃO: Verificar se username já existe
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
      setErro('Preencha todos os campos');
      return;
    }

    // ✅ VALIDAÇÕES ROBUSTAS
    const usernameClean = username.trim().toLowerCase();
    
    // ✅ Tamanho mínimo: 3 caracteres
    if (usernameClean.length < 3) {
      setErro('Username deve ter pelo menos 3 caracteres');
      return;
    }

    // ✅ Formato válido: Apenas letras, números e _
    if (!/^[a-zA-Z0-9_]+$/.test(usernameClean)) {
      setErro('Username pode conter apenas letras, números e _');
      return;
    }

    // ✅ Senha forte: Mínimo 6 caracteres
    if (senha.length < 6) {
      setErro('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      // ✅ USERNAME ÚNICO: Verificar se já existe
      const usernameExiste = await verificarUsername(usernameClean);
      if (usernameExiste) {
        setErro('❌ Username já está em uso. Escolha outro.');
        setCarregando(false);
        return;
      }

      // Criar conta no Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      const uid = cred.user.uid;

      // Salvar dados do usuário no Firestore
      await setDoc(doc(db, 'usuarios', uid), {
        email: email.trim(),
        username: usernameClean,
        criadoEm: new Date(),
      });

      // Redirecionar para página de produtos
      router.push('/cadastro');

    } catch (error) {
      console.error('Erro no registro:', error);
      
      // Type guard para verificar se é um FirebaseError
      if (error instanceof FirebaseError || (error as AuthError)?.code) {
        const firebaseError = error as AuthError;
        
        // Tratar diferentes tipos de erro
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
        // Para outros tipos de erro
        setErro('Erro inesperado. Tente novamente');
      }
    } finally {
      setCarregando(false);
    }
  };

  // Permitir registro com Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      registrar();
    }
  };

  // ✅ FORMATAÇÃO AUTOMÁTICA: Remove caracteres inválidos
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(value);
  };

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center">
      <div className="border rounded-lg p-6 shadow-sm bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Criar Conta</h1>
          <p className="text-gray-600">Crie sua conta e comece a vender online</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome de usuário
            </label>
            <input
              type="text"
              placeholder="ex: joana, lojinha_da_maria"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username) 
                  ? 'focus:ring-green-500 border-green-300' 
                  : 'focus:ring-green-500'
              }`}
              value={username}
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
              disabled={carregando}
              maxLength={20}
            />
            {/* ✅ VALIDAÇÃO VISUAL em tempo real */}
            {username && (
              <div className="mt-1 text-xs">
                {username.length < 3 && (
                  <p className="text-red-500">❌ Mínimo 3 caracteres</p>
                )}
                {username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username) && (
                  <p className="text-green-600">✅ Username válido</p>
                )}
              </div>
            )}
            {/* ✅ PREVIEW DO LINK: Mostra como será o catálogo */}
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-1">
              <p className="text-xs text-blue-600">
                🔗 Seu catálogo será: <span className="font-mono font-bold">/{username || 'seunome'}</span>
              </p>
              {username && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Link disponível: <span className="font-mono">seusite.com/{username}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              placeholder="Mínimo 6 caracteres"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                senha.length >= 6 
                  ? 'focus:ring-green-500 border-green-300' 
                  : 'focus:ring-green-500'
              }`}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={carregando}
            />
            {/* ✅ VALIDAÇÃO VISUAL da senha */}
            {senha && (
              <div className="mt-1 text-xs">
                {senha.length < 6 && (
                  <p className="text-red-500">❌ Mínimo 6 caracteres</p>
                )}
                {senha.length >= 6 && (
                  <p className="text-green-600">✅ Senha forte</p>
                )}
              </div>
            )}
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
              ⚠️ {erro}
            </div>
          )}

          {/* ✅ ESTADOS DE CARREGAMENTO: Feedback durante criação */}
          <button 
            onClick={registrar}
            disabled={carregando || !username.trim() || !email.trim() || !senha.trim()}
            className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            {carregando ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando conta...
              </>
            ) : 'Criar Conta'}
          </button>
        </div>

        <hr className="my-6" />

        <div className="text-center space-y-3">
          <p className="text-gray-600">
            Já tem uma conta?
          </p>
          <button
            onClick={() => router.push('/login')}
            className="text-green-600 hover:underline font-medium"
          >
            Fazer login
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