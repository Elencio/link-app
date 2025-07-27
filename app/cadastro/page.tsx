"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  type Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { signOut, type User } from "firebase/auth"
import {
  Plus,
  Package,
  DollarSign,
  ImageIcon,
  FileText,
  Settings,
  LogOut,
  Edit3,
  Trash2,
  Save,
  X,
  Upload,
  Calendar,
  TrendingUp,
  ShoppingBag,
  Lightbulb,
  UserIcon,
  CheckCircle,
} from "lucide-react"

interface Produto {
  id: string
  uid: string
  nome: string
  descricao: string
  preco: string
  imagemBase64: string
  criadoEm: Timestamp
  servicosPrestados?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [imagem, setImagem] = useState<File | null>(null)
  const [servicosPrestados, setServicosPrestados] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login")
      else setUser(user)
    })
    return unsubscribe
  }, [router])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "produtos"), where("uid", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProdutos(
        snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Produto,
        ),
      )
    })
    return unsubscribe
  }, [user])

  const converterParaBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const logout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  const limparFormulario = () => {
    setNome("")
    setDescricao("")
    setPreco("")
    setImagem(null)
    setServicosPrestados("")
    setProdutoEditandoId(null)
    setModoEdicao(false)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const salvarProduto = async () => {
    if (!nome || !preco) {
      alert("Preencha o nome e preço do produto")
      return
    }
    setCarregando(true)
    try {
      let imagemBase64: string | undefined
      if (imagem) {
        if (imagem.size > 2 * 1024 * 1024) {
          alert("Imagem muito grande! Máximo 2MB")
          setCarregando(false)
          return
        }
        imagemBase64 = await converterParaBase64(imagem)
      }
      if (modoEdicao && produtoEditandoId) {
        const docRef = doc(db, "produtos", produtoEditandoId)
        await updateDoc(docRef, {
          nome,
          descricao,
          preco,
          servicosPrestados,
          ...(imagemBase64 && { imagemBase64 }),
        })
        alert("Produto atualizado com sucesso!")
      } else {
        await addDoc(collection(db, "produtos"), {
          uid: user?.uid,
          nome,
          descricao,
          preco,
          servicosPrestados,
          imagemBase64: imagemBase64 || "",
          criadoEm: new Date(),
        })
        alert("Produto adicionado com sucesso!")
      }
      limparFormulario()
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      alert("Erro ao salvar produto. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  const iniciarEdicao = (produto: Produto) => {
    setModoEdicao(true)
    setProdutoEditandoId(produto.id)
    setNome(produto.nome)
    setDescricao(produto.descricao)
    setPreco(produto.preco)
    setServicosPrestados(produto.servicosPrestados || "")
    setImagem(null)

    // Scroll para o formulário
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const apagarProduto = async (id: string) => {
    const confirmar = confirm("Tem certeza que deseja remover este produto?")
    if (!confirmar) return
    try {
      await deleteDoc(doc(db, "produtos", id))
      alert("Produto removido com sucesso!")
    } catch (error) {
      console.error("Erro ao apagar produto:", error)
      alert("Erro ao remover produto.")
    }
  }

  const totalValue = produtos.reduce((sum, p) => sum + Number.parseFloat(p.preco || "0"), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard de Produtos</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {user?.email}
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {produtos.length} produtos
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 font-medium"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da conta
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{produtos.length}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">Total de Produtos</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">R$ {totalValue.toFixed(2)}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">Valor Total</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{produtos.filter((p) => p.imagemBase64).length}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">Com Imagens</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <ImageIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
              {modoEdicao ? <Edit3 className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {modoEdicao ? "Editar Produto" : "Adicionar Novo Produto"}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Nome do produto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Package className="h-4 w-4 inline mr-2" />
                Nome do produto *
              </label>
              <input
                type="text"
                placeholder="Ex: Bolo de chocolate, Camiseta básica..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Preço (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>

            {/* Upload de imagem */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <ImageIcon className="h-4 w-4 inline mr-2" />
                Imagem do produto
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  onChange={(e) => setImagem(e.target.files?.[0] || null)}
                />
                <Upload className="h-5 w-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              {imagem && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {imagem.name} ({(imagem.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FileText className="h-4 w-4 inline mr-2" />
                Descrição
              </label>
              <textarea
                placeholder="Descreva seu produto, materiais, tamanhos disponíveis..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            {/* Serviços */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Settings className="h-4 w-4 inline mr-2" />
                Serviços adicionais (opcional)
              </label>
              <textarea
                placeholder="Ex: entrega grátis, personalização, garantia..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                rows={3}
                value={servicosPrestados}
                onChange={(e) => setServicosPrestados(e.target.value)}
              />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={salvarProduto}
              disabled={carregando || !nome || !preco}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
            >
              {carregando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  {modoEdicao ? "Salvando..." : "Adicionando..."}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  {modoEdicao ? "Salvar Alterações" : "Adicionar Produto"}
                </>
              )}
            </button>
            {modoEdicao && (
              <button
                onClick={limparFormulario}
                className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center justify-center"
              >
                <X className="h-5 w-5 mr-2" />
                Cancelar Edição
              </button>
            )}
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-6 w-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Meus Produtos ({produtos.length})</h2>
              </div>
              {produtos.length > 0 && (
                <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                  <span className="text-sm font-semibold text-gray-700">Total: R$ {totalValue.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {produtos.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhum produto cadastrado</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Adicione seu primeiro produto usando o formulário acima e comece a vender online
                </p>
                <div className="bg-blue-50 rounded-xl p-4 max-w-md mx-auto">
                  <div className="flex items-center text-blue-700">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    <span className="font-medium">Dica: Produtos com fotos vendem 3x mais!</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {produtos.map((produto, index) => (
                  <div
                    key={produto.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    {produto.imagemBase64 ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={produto.imagemBase64 || "/placeholder.svg"}
                          alt={produto.nome}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2">{produto.nome}</h3>

                      {produto.descricao && (
                        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{produto.descricao}</p>
                      )}

                      {produto.servicosPrestados && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <p className="text-blue-700 text-sm flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            {produto.servicosPrestados}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-green-600 font-bold text-2xl">R$ {produto.preco}</p>
                        {produto.criadoEm && (
                          <div className="flex items-center text-gray-400 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {produto.criadoEm.toDate().toLocaleDateString("pt-BR")}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => iniciarEdicao(produto)}
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center group"
                        >
                          <Edit3 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          Editar
                        </button>
                        <button
                          onClick={() => apagarProduto(produto.id)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center group"
                        >
                          <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Success Tips */}
        {produtos.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500 rounded-full p-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Dicas para vender mais</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700">Adicione fotos de alta qualidade em todos os produtos</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700">Escreva descrições detalhadas e atrativas</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700">Mantenha os preços sempre atualizados</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700">Compartilhe seu catálogo nas redes sociais</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
