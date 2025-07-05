'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    Timestamp,
} from 'firebase/firestore';
import { signOut, User } from 'firebase/auth';

// Interfaces para tipagem
interface Produto {
    id: string;
    uid: string;
    nome: string;
    descricao: string;
    preco: string;
    imagemBase64: string;
    criadoEm: Timestamp;
}

export default function CadastroPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);
    const [carregando, setCarregando] = useState(false);

    // Protege a rota
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) router.push('/login');
            else setUser(user);
        });
        return unsubscribe;
    }, [router]);

    // Carrega produtos do usuário logado
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'produtos'), where('uid', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProdutos(snapshot.docs.map((doc) => ({ 
                id: doc.id, 
                ...doc.data() 
            } as Produto)));
        });
        return unsubscribe;
    }, [user]);

    // Função para converter arquivo para Base64
    const converterParaBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const logout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const adicionarProduto = async () => {
        if (!imagem || !nome || !preco) {
            return alert('Preencha todos os campos');
        }

        // Verificar tamanho da imagem (máximo 1MB para Base64)
        if (imagem.size > 1024 * 1024) {
            return alert('Imagem muito grande! Máximo 1MB');
        }

        setCarregando(true);

        try {
            // Converter imagem para Base64
            const imagemBase64 = await converterParaBase64(imagem);

            // Salvar produto no Firestore com imagem em Base64
            await addDoc(collection(db, 'produtos'), {
                uid: user?.uid,
                nome,
                descricao,
                preco,
                imagemBase64, // Armazena a imagem como string Base64
                criadoEm: new Date(),
            });

            // Limpar campos
            setNome('');
            setDescricao('');
            setPreco('');
            setImagem(null);
            
            // Limpar o input de arquivo
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            alert('Produto adicionado com sucesso!');

        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            alert('Erro ao adicionar produto. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Meus Produtos</h1>
                <p className="text-gray-600">Olá, {user?.email}</p>
            </div>

            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h2 className="text-lg font-semibold mb-4">Adicionar Novo Produto</h2>
                
                <input
                    type="text"
                    placeholder="Nome do produto"
                    className="w-full p-2 mb-2 border rounded"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                
                <textarea
                    placeholder="Descrição"
                    className="w-full p-2 mb-2 border rounded"
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
                
                <input
                    type="number"
                    placeholder="Preço (R$)"
                    className="w-full p-2 mb-2 border rounded"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                />
                
                <input
                    type="file"
                    accept="image/*"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={(e) => setImagem(e.target.files?.[0] || null)}
                />
                
                {imagem && (
                    <div className="mb-2 text-sm text-gray-600">
                        <p>Arquivo selecionado: {imagem.name}</p>
                        <p>Tamanho: {(imagem.size / 1024 / 1024).toFixed(2)} MB</p>
                        {imagem.size > 1024 * 1024 && (
                            <p className="text-red-500">⚠️ Arquivo muito grande! Máximo 1MB</p>
                        )}
                    </div>
                )}
                
                <button 
                    onClick={adicionarProduto} 
                    disabled={carregando || !imagem || !nome || !preco}
                    className="bg-blue-600 text-white w-full py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {carregando ? 'Adicionando...' : 'Adicionar Produto'}
                </button>
            </div>

            <hr className="my-6" />

            <h2 className="text-xl font-semibold mb-4">Lista de Produtos ({produtos.length})</h2>
            
            {produtos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    Nenhum produto cadastrado ainda. Adicione seu primeiro produto acima!
                </p>
            ) : (
                <div className="space-y-4">
                    {produtos.map((produto) => (
                        <div key={produto.id} className="border p-4 rounded-lg shadow-sm">
                            {produto.imagemBase64 && (
                                <div className="relative h-48 w-full mb-3">
                                    <Image 
                                        src={produto.imagemBase64} 
                                        alt={produto.nome} 
                                        fill
                                        className="object-cover rounded"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                            <h3 className="font-bold text-lg">{produto.nome}</h3>
                            <p className="text-gray-600 mb-2">{produto.descricao}</p>
                            <p className="text-green-700 font-semibold text-lg">
                                R$ {produto.preco}
                            </p>
                            {produto.criadoEm && (
                                <p className="text-gray-400 text-sm mt-2">
                                    Criado em: {produto.criadoEm.toDate().toLocaleDateString('pt-BR')}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={logout}
                className="bg-red-600 text-white w-full py-2 mt-6 rounded hover:bg-red-700"
            >
                Sair
            </button>
        </div>
    );
}