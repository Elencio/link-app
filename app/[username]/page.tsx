import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import BotaoCompartilhar from "./components/BotaoCompartilhar"
import Link from "next/link"
import Image from "next/image"
import {
  ShoppingBag,
  Phone,
  MessageCircle,
  ArrowRight,
  Package,
  Search,
  UserPlus,
  Home,
  Shield,
  Star,
  Eye,
  ExternalLink,
  Sparkles,
} from "lucide-react"

interface Props {
  params: Promise<{
    username: string
  }>
}

interface Produto {
  id: string
  nome: string
  descricao: string
  preco: string
  imagemBase64: string
  servicosPrestados?: string
}

interface Usuario {
  username: string
  telefone?: string
  nomeCompleto?: string
  email?: string
}

export default async function PublicCatalogPage({ params }: Props) {
  const { username } = await params

  const userSnapshot = await getDocs(query(collection(db, "usuarios"), where("username", "==", username)))

  if (userSnapshot.empty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-8 text-center">
                <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Usuário não encontrado</h1>
                <p className="text-red-100">O catálogo que você procura não existe</p>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-gray-600 mb-6">
                    O usuário{" "}
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg font-semibold text-gray-900">
                      @{username}
                    </span>{" "}
                    não existe ou não possui um catálogo público.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link
                    href="/"
                    className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold flex items-center justify-center"
                  >
                    <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Voltar à página inicial
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/register"
                    className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold flex items-center justify-center"
                  >
                    <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Criar meu catálogo gratuito
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="mt-8 text-center">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-700 font-medium">💡 Crie seu próprio catálogo digital em minutos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const userDoc = userSnapshot.docs[0]
  const uid = userDoc.id
  const userData = userDoc.data() as Usuario

  const produtosSnapshot = await getDocs(query(collection(db, "produtos"), where("uid", "==", uid)))

  const produtos: Produto[] = produtosSnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      nome: data.nome || "",
      descricao: data.descricao || "",
      preco: data.preco || "0",
      imagemBase64: data.imagemBase64 || "",
      servicosPrestados: data.servicosPrestados || "",
    }
  })

  const gerarLinkWhatsApp = (produto: Produto) => {
    const telefone = userData.telefone || ""
    const nomeVendedor = userData.nomeCompleto || username
    const linkCatalogo = `https://link-app-ruby.vercel.app/${username}`
    const mensagem = `🛍️ *Interesse em produto*

📦 *Produto:* ${produto.nome}
💰 *Preço:* R$ ${produto.preco}
📋 *Descrição:* ${produto.descricao}

👋 Olá ${nomeVendedor}! Vi este produto no seu catálogo e tenho interesse. Podemos conversar?

🔗 Catálogo: ${linkCatalogo}`

    if (telefone) {
      return `https://wa.me/55${telefone.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`
    }
    return `https://wa.me/?text=${encodeURIComponent(mensagem)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">CatálogoDigital</span>
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm"
            >
              Criar meu catálogo
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Catalog Header */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">🛍️</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {userData.nomeCompleto || `@${username}`}
            </h1>

            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center text-gray-600">
                <Package className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
                </span>
              </div>
              {userData.telefone && (
                <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">WhatsApp disponível</span>
                </div>
              )}
            </div>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Catálogo Digital Profissional • Produtos selecionados com qualidade
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {produtos.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-12">
              <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Catálogo em construção</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Este vendedor ainda está organizando seus produtos. Volte em breve para ver as novidades!
              </p>
              <Link
                href="/register"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold group"
              >
                <UserPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Criar meu próprio catálogo
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {produtos.map((produto, index) => (
              <div
                key={produto.id}
                className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                {produto.imagemBase64 ? (
                  <Link href={`/${username}/${produto.id}`}>
                    <div className="relative h-56 w-full cursor-pointer overflow-hidden">
                      <Image
                        src={produto.imagemBase64 || "/placeholder.svg"}
                        alt={produto.nome}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="h-4 w-4 text-gray-700" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500">Sem imagem</span>
                    </div>
                  </div>
                )}

                {/* Product Content */}
                <div className="p-6">
                  <h2 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {produto.nome}
                  </h2>

                  {produto.descricao && (
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 leading-relaxed">{produto.descricao}</p>
                  )}

                  {produto.servicosPrestados && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                      <p className="text-blue-700 text-sm flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        <span className="font-medium">Serviços:</span>
                        <span className="ml-1">{produto.servicosPrestados}</span>
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full">
                      <span className="text-xl font-bold">R$ {produto.preco}</span>
                    </div>
                    <Link
                      href={`/${username}/${produto.id}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium flex items-center"
                    >
                      Ver detalhes
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>

                  {/* WhatsApp Button */}
                  <Link
                    href={gerarLinkWhatsApp(produto)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center transform hover:-translate-y-1"
                  >
                    <MessageCircle className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Pedir no WhatsApp
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Catalog Footer */}
        <div className="mt-20">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gostou do catálogo?</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Compartilhe com seus amigos ou crie o seu próprio catálogo digital gratuito
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <BotaoCompartilhar nomeVendedor={userData.nomeCompleto || username} />

              <Link
                href="/"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold flex items-center"
              >
                <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Ver outros catálogos
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/register"
                className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold flex items-center"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Criar meu catálogo
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-700 font-semibold">CatálogoDigital - Simples, rápido e gratuito</p>
              <p className="text-sm text-gray-600">Crie o seu em poucos minutos e comece a vender online</p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="flex justify-center mt-8">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-6 py-3 shadow-sm">
            <div className="flex items-center text-gray-600 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              <span className="font-medium">Plataforma segura e confiável</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
