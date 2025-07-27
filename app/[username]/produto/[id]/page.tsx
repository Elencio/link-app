import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, ShoppingBag, Star, Share2, Heart, CheckCircle, User, Phone } from 'lucide-react'

interface Params {
  params: Promise<{ username: string; id: string }>
}

export default async function ProdutoDetalhadoPage({ params }: Params) {
  const { username, id } = await params

  const userQuery = query(collection(db, 'usuarios'), where('username', '==', username))
  const userSnapshot = await getDocs(userQuery)
  
  if (userSnapshot.empty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <User className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Usuário não encontrado</h1>
          <p className="text-gray-600 mb-6">O perfil que você está procurando não existe.</p>
          <Link 
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  const user = userSnapshot.docs[0]
  const userData = user.data()

  const produtoRef = doc(db, 'produtos', id)
  const produtoDoc = await getDoc(produtoRef)
  
  if (!produtoDoc.exists()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-orange-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">O produto que você está procurando não existe mais.</p>
          <Link 
            href={`/${username}`}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  const produto = produtoDoc.data()

  const linkWhatsApp = `https://wa.me/55${userData.telefone}?text=${encodeURIComponent(
    `Olá ${userData.nomeCompleto || username}, tenho interesse no produto "${produto.nome}".`
  )}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/${username}`}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar ao catálogo
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={produto.imagemBase64 || "/placeholder.svg"}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Seller Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{userData.nomeCompleto || username}</h3>
                  <p className="text-sm text-gray-600">@{username}</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {produto.nome}
                  </h1>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full">
                      <span className="text-2xl font-bold">R$ {produto.preco}</span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                    </div>
                  </div>
                </div>

                {produto.descricao && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                    <p className="text-gray-700 leading-relaxed">{produto.descricao}</p>
                  </div>
                )}

                {produto.servicosPrestados && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Serviços Oferecidos
                    </h3>
                    <p className="text-blue-800">{produto.servicosPrestados}</p>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">Entrega Rápida</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">Qualidade Garantida</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="space-y-4">
                  <Link
                    href={linkWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center text-lg"
                  >
                    <MessageCircle className="h-6 w-6 mr-3" />
                    Pedir no WhatsApp
                    <div className="ml-3 opacity-75 group-hover:opacity-100 transition-opacity">
                      <Phone className="h-4 w-4" />
                    </div>
                  </Link>
                  
                  <p className="text-center text-sm text-gray-600">
                    Clique para conversar diretamente com o vendedor
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Dica</h3>
              <p className="text-gray-700 text-sm">
                Ao entrar em contato, mencione que viu este produto no catálogo digital. 
                Isso ajuda o vendedor a te atender melhor!
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Outros produtos de {userData.nomeCompleto || username}
            </h2>
            <div className="text-center">
              <Link
                href={`/${username}`}
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 group"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ver catálogo completo
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
