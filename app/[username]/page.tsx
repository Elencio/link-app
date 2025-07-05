import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
  servicosPrestados?: string;
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
      <div className="max-w-md mx-auto p-8 min-h-screen flex flex-col justify-center text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Usuário não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            O usuário <span className="font-mono bg-gray-100 px-2 py-1 rounded">@{username}</span> não existe ou não possui um catálogo público.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            🏠 Voltar à página inicial
          </Link>
          
          <Link
            href="/register"
            className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            ✨ Criar meu catálogo gratuito
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Crie seu próprio catálogo digital em minutos
        </div>
      </div>
    );
  }

  const userDoc = userSnapshot.docs[0];
  const uid = userDoc.id;
  const userData = userDoc.data() as Usuario;

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
      servicosPrestados: data.servicosPrestados || '',
    };
  });

  const gerarLinkWhatsApp = (produto: Produto) => {
    const telefone = userData.telefone || '';
    const nomeVendedor = userData.nomeCompleto || username;
    const linkCatalogo = `https://link-app-ruby.vercel.app/${username}`;

    const mensagem = `🛍️ *Interesse em produto*

📦 *Produto:* ${produto.nome}
💰 *Preço:* R$ ${produto.preco}
📋 *Descrição:* ${produto.descricao}

👋 Olá ${nomeVendedor}! Vi este produto no seu catálogo e tenho interesse. Podemos conversar?

🔗 Catálogo: ${linkCatalogo}`;

    if (telefone) {
      return `https://wa.me/55${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    }

    return `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      {/* Header do catálogo */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
            <span className="text-4xl">🛍️</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {userData.nomeCompleto || `@${username}`}
          </h1>
          
          <p className="text-xl text-gray-600 mb-4">
            Catálogo Digital • {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} disponíveis
          </p>

          {userData.telefone && (
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
              <span className="mr-2">📱</span>
              Atendimento via WhatsApp
            </div>
          )}
        </div>
      </div>

      {/* Lista de produtos */}
      {produtos.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Catálogo em construção
            </h2>
            <p className="text-gray-600 mb-6">
              Este vendedor ainda não adicionou produtos ao catálogo.
            </p>
            <Link
              href="/register"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Criar meu próprio catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Imagem do produto */}
              {produto.imagemBase64 ? (
                <Link href={`/${username}/produto/${produto.id}`}>
                  <div className="relative h-56 w-full cursor-pointer group">
                    <Image
                      src={produto.imagemBase64}
                      alt={produto.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={400}
                      height={224}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                </Link>
              ) : (
                <div className="h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📷</span>
                </div>
              )}

              {/* Conteúdo do produto */}
              <div className="p-6">
                <h2 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2">
                  {produto.nome}
                </h2>
                
                <p className="text-gray-600 mb-3 text-sm line-clamp-3">
                  {produto.descricao}
                </p>

                {/* {produto.servicosPrestados && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-blue-700 text-sm">
                      <span className="font-medium">🔧 Serviços:</span> {produto.servicosPrestados}
                    </p>
                  </div>
                )} */}

                <div className="flex items-center justify-between mb-4">
                  <p className="text-green-600 font-bold text-2xl">
                    R$ {produto.preco}
                  </p>
                </div>

                {/* Botão WhatsApp */}
                <Link
                  href={gerarLinkWhatsApp(produto)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  💬 Pedir no WhatsApp
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer do catálogo */}
      <div className="text-center mt-16 pt-12 border-t border-gray-200">
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Gostou do catálogo?
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <BotaoCompartilhar
              nomeVendedor={userData.nomeCompleto || username}
            />
            
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              🏠 Ver outros catálogos
            </Link>
            
            <Link
              href="/register"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              ✨ Criar meu catálogo
            </Link>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600 font-medium">
              Catálogo Digital - Simples, rápido e gratuito
            </p>
            <p className="text-sm text-gray-500">
              Crie o seu em poucos minutos e comece a vender online
            </p>
          </div>
        </div>
      </div>

      {/* Selo de confiança */}
      <div className="flex justify-center mt-8">
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-3 shadow-sm">
          <div className="flex items-center text-gray-600 text-sm">
            <span className="mr-2">🔒</span>
            <span>Plataforma segura e confiável</span>
          </div>
        </div>
      </div>
    </div>
  );
}