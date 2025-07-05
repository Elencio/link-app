import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

interface Params {
  params: Promise<{ username: string; id: string }>;
}

export default async function ProdutoDetalhadoPage({ params }: Params) {
  const { username, id } = await params;

  const userQuery = query(collection(db, 'usuarios'), where('username', '==', username));
  const userSnapshot = await getDocs(userQuery);
  if (userSnapshot.empty) return <div>Usuário não encontrado</div>;

  const user = userSnapshot.docs[0];
  const userData = user.data();


  const produtoRef = doc(db, 'produtos', id);
  const produtoDoc = await getDoc(produtoRef);
  if (!produtoDoc.exists()) return <div>Produto não encontrado</div>;

  const produto = produtoDoc.data();

  const linkWhatsApp = `https://wa.me/55${userData.telefone}?text=${encodeURIComponent(
    `Olá ${userData.nomeCompleto || username}, tenho interesse no produto "${produto.nome}".`
  )}`;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{produto.nome}</h1>

      <Image
        src={produto.imagemBase64}
        alt={produto.nome}
        width={800}
        height={400}
        className="rounded-lg mb-4"
      />

      <p className="text-xl text-green-600 mb-2">R$ {produto.preco}</p>
      <p className="mb-4 text-gray-700">{produto.descricao}</p>

      {produto.servicosPrestados && (
        <div className="mb-4 text-blue-700">
          <strong>Serviços oferecidos:</strong> {produto.servicosPrestados}
        </div>
      )}

      <Link
        href={linkWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Pedir no WhatsApp
      </Link>

      <div className="mt-8">
        <Link href={`/${username}`} className="text-blue-600 hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}
