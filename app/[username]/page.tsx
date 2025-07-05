import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import BotaoCopiarProduto from './components/BotaoCopiarProduto';
import BotaoCompartilhar from './components/BotaoCompartilhar';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  params: Promise<{
    username: string;
  }>;
}

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  imagemBase64: string;
}

interface Usuario {
  username: string;
  telefone?: string;
  nomeCompleto?: string;
  email?: string;
}

export default async function PublicCatalogPage({ params }: Props) {
  const { username } = await params;

  const userSnapshot = await getDocs(
    query(collection(db, 'usuarios'), where('username', '==', username))
  );

  if (userSnapshot.empty) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center mt-10">
        <div className="text-red-600 text-xl mb-4">❌ Usuário não encontrado</div>
        <p className="text-gray-600">
          O usuário <strong>@{username}</strong> não existe ou não tem um catálogo público.
        </p>
        <Link 
          href="/" 
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Voltar à página inicial
        </Link>
      </div>
    );
  }

  const userDoc = userSnapshot.docs[0];
  const uid = userDoc.id;
  const userData = userDoc.data() as Usuario;

  // Buscar os produtos desse usuário
  const produtosSnapshot = await getDocs(
    query(collection(db, 'produtos'), where('uid', '==', uid))
  );

  const produtos: Produto[] = produtosSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      nome: data.nome || '',
      descricao: data.descricao || '',
      preco: data.preco || '0',
      imagemBase64: data.imagemBase64 || '',
    };
  });

  // 🔧 FUNÇÃO PARA GERAR LINK WHATSAPP
  const gerarLinkWhatsApp = (produto: Produto) => {
    const telefone = userData.telefone || '';
    const nomeVendedor = userData.nomeCompleto || username;
    
    const mensagem = `🛍️ *Interesse em produto*
    
📦 *Produto:* ${produto.nome}
💰 *Preço:* R$ ${produto.preco}
📋 *Descrição:* ${produto.descricao}

👋 Olá ${nomeVendedor}! Vi este produto no seu catálogo e tenho interesse. Podemos conversar?

🔗 Catálogo: [LINK_DO_CATALOGO]`;

    // Se tem telefone cadastrado, usar o número específico
    if (telefone) {
      return `https://wa.me/55${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    }
    
    // Senão, usar WhatsApp geral (usuário escolhe contato)
    return `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 🏪 HEADER DO CATÁLOGO */}
      <div className="text-center mb-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">🛍️ {userData.nomeCompleto || `@${username}`}</h1>
        <p className="text-gray-600 mb-4">
          {produtos.length} {produtos.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
        </p>
        
        {/* 📞 CONTATO DIRETO */}
        {userData.telefone && (
          <div className="mb-4">
            <Link
              href={`https://wa.me/55${userData.telefone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📱 Falar com {userData.nomeCompleto || username}
            </Link>
          </div>
        )}
      </div>

      {produtos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">📦 Nenhum produto encontrado</div>
          <p className="text-gray-400">
            Este usuário ainda não adicionou produtos ao catálogo.
          </p>
        </div>
      )}

      {/* 🛒 GRID DE PRODUTOS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {produtos.map((produto) => (
          <div key={produto.id} className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow bg-white">
            {produto.imagemBase64 && (
              <div className="relative h-48 w-full">
                <Image
                  src={produto.imagemBase64}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                  width={400}
                  height={192}
                />
              </div>
            )}
            
            <div className="p-4">
              <h2 className="font-bold text-xl mb-2">{produto.nome}</h2>
              <p className="text-gray-600 mb-3 line-clamp-2">{produto.descricao}</p>
              <p className="text-green-600 font-bold text-2xl mb-4">
                R$ {produto.preco}
              </p>
              
              {/* 🟢 BOTÃO WHATSAPP (Link simples - sem JavaScript) */}
              <Link
                href={gerarLinkWhatsApp(produto)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                💬 Pedir no WhatsApp
              </Link>
              
              {/* 📋 BOTÃO COPIAR (Client Component) */}
              <BotaoCopiarProduto 
                nome={produto.nome}
                preco={produto.preco}
                descricao={produto.descricao}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 📊 FOOTER COM AÇÕES */}
      <div className="text-center mt-12 pt-8 border-t space-y-4">
        <div className="flex flex-wrap justify-center gap-4">
          {/* 📱 COMPARTILHAR CATÁLOGO (Client Component) */}
          <BotaoCompartilhar 
            nomeVendedor={userData.nomeCompleto || username}
          />
          
          {/* 🏠 VOLTAR */}
          <Link 
            href="/" 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            🏠 Ver outros catálogos
          </Link>
        </div>
        
        <p className="text-gray-500 text-sm">
          Powered by Catálogo Digital • Crie o seu gratuitamente
        </p>
      </div>
    </div>
  );
}