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
    doc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { signOut, User } from 'firebase/auth';

interface Produto {
    id: string;
    uid: string;
    nome: string;
    descricao: string;
    preco: string;
    imagemBase64: string;
    criadoEm: Timestamp;
    servicosPrestados?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);
    const [servicosPrestados, setServicosPrestados] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) router.push('/login');
            else setUser(user);
        });
        return unsubscribe;
    }, [router]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'produtos'), where('uid', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProdutos(snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Produto)));
        });
        return unsubscribe;
    }, [user]);

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

    const limparFormulario = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setImagem(null);
        setServicosPrestados('');
        setProdutoEditandoId(null);
        setModoEdicao(false);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const salvarProduto = async () => {
        if (!nome || !preco) {
            alert('Preencha o nome e preço do produto');
            return;
        }

        setCarregando(true);

        try {
            let imagemBase64: string | undefined;

            if (imagem) {
                if (imagem.size > 2 * 1024 * 1024) {
                    alert('Imagem muito grande! Máximo 2MB');
                    setCarregando(false);
                    return;
                }
                imagemBase64 = await converterParaBase64(imagem);
            }

            if (modoEdicao && produtoEditandoId) {
                const docRef = doc(db, 'produtos', produtoEditandoId);
                await updateDoc(docRef, {
                    nome,
                    descricao,
                    preco,
                    servicosPrestados,
                    ...(imagemBase64 && { imagemBase64 }),
                });
                alert('Produto atualizado com sucesso!');
            } else {
                await addDoc(collection(db, 'produtos'), {
                    uid: user?.uid,
                    nome,
                    descricao,
                    preco,
                    servicosPrestados,
                    imagemBase64: imagemBase64 || '',
                    criadoEm: new Date(),
                });
                alert('Produto adicionado com sucesso!');
            }

            limparFormulario();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    const iniciarEdicao = (produto: Produto) => {
        setModoEdicao(true);
        setProdutoEditandoId(produto.id);
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setPreco(produto.preco);
        setServicosPrestados(produto.servicosPrestados || '');
        setImagem(null);
        
        // Scroll para o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const apagarProduto = async (id: string) => {
        const confirmar = confirm('Tem certeza que deseja remover este produto?');
        if (!confirmar) return;

        try {
            await deleteDoc(doc(db, 'produtos', id));
            alert('Produto removido com sucesso!');
        } catch (error) {
            console.error('Erro ao apagar produto:', error);
            alert('Erro ao remover produto.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900 mb-2">
                            Dashboard de Produtos
                        </h1>
                        <p className="text-blue-700">
                            Olá, {user?.email} • {produtos.length} produtos cadastrados
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Sair da conta
                        </button>
                    </div>
                </div>
            </div>

            {/* Formulário de Produto */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                    {modoEdicao ? '📝 Editar Produto' : '➕ Adicionar Novo Produto'}
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Nome do produto */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do produto *
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Bolo de chocolate, Camiseta básica..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    {/* Preço */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço (R$) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                        />
                    </div>

                    {/* Upload de imagem */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Imagem do produto
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            onChange={(e) => setImagem(e.target.files?.[0] || null)}
                        />
                        {imagem && (
                            <p className="text-sm text-gray-600 mt-1">
                                📁 {imagem.name} ({(imagem.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                    </div>

                    {/* Descrição */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição
                        </label>
                        <textarea
                            placeholder="Descreva seu produto, materiais, tamanhos disponíveis..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            rows={3}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    {/* Serviços */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Serviços adicionais (opcional)
                        </label>
                        <textarea
                            placeholder="Ex: entrega grátis, personalização, garantia..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            rows={2}
                            value={servicosPrestados}
                            onChange={(e) => setServicosPrestados(e.target.value)}
                        />
                    </div>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                        onClick={salvarProduto}
                        disabled={carregando || !nome || !preco}
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        {carregando ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {modoEdicao ? 'Salvando...' : 'Adicionando...'}
                            </>
                        ) : (
                            modoEdicao ? '💾 Salvar Alterações' : '➕ Adicionar Produto'
                        )}
                    </button>

                    {modoEdicao && (
                        <button
                            onClick={limparFormulario}
                            className="bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        >
                            ❌ Cancelar Edição
                        </button>
                    )}
                </div>
            </div>

            {/* Lista de Produtos */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        📦 Meus Produtos ({produtos.length})
                    </h2>
                    {produtos.length > 0 && (
                        <div className="text-sm text-gray-600">
                            Total: R$ {produtos.reduce((sum, p) => sum + parseFloat(p.preco || '0'), 0).toFixed(2)}
                        </div>
                    )}
                </div>

                {produtos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            Nenhum produto cadastrado
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Adicione seu primeiro produto usando o formulário acima
                        </p>
                        <div className="text-sm text-blue-600">
                            💡 Dica: Produtos com fotos vendem 3x mais!
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {produtos.map((produto) => (
                            <div key={produto.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {produto.imagemBase64 && (
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={produto.imagemBase64}
                                            alt={produto.nome}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 text-gray-900">{produto.nome}</h3>
                                    
                                    {produto.descricao && (
                                        <p className="text-gray-600 mb-2 text-sm line-clamp-2">{produto.descricao}</p>
                                    )}
                                    
                                    {produto.servicosPrestados && (
                                        <p className="text-blue-600 mb-2 text-sm italic">
                                            🔧 {produto.servicosPrestados}
                                        </p>
                                    )}
                                    
                                    <p className="text-green-700 font-bold text-xl mb-3">
                                        R$ {produto.preco}
                                    </p>
                                    
                                    {produto.criadoEm && (
                                        <p className="text-gray-400 text-xs mb-3">
                                            📅 {produto.criadoEm.toDate().toLocaleDateString('pt-BR')}
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => iniciarEdicao(produto)}
                                            className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => apagarProduto(produto.id)}
                                            className="flex-1 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition-colors text-sm font-medium"
                                        >
                                            🗑️ Remover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dicas de sucesso */}
            {produtos.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                    <h3 className="font-semibold text-green-800 mb-3">🚀 Dicas para vender mais:</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>• Adicione fotos de alta qualidade em todos os produtos</li>
                        <li>• Escreva descrições detalhadas e atrativas</li>
                        <li>• Mantenha os preços sempre atualizados</li>
                        <li>• Compartilhe seu catálogo nas redes sociais</li>
                    </ul>
                </div>
            )}
        </div>
    );
}