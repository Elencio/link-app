"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { signOut } from "firebase/auth"
import {
  Users,
  ShoppingBag,
  Phone,
  Calendar,
  ExternalLink,
  RefreshCw,
  LogOut,
  Shield,
  TrendingUp,
  UserCheck,
  MessageCircle,
  BarChart3,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

const ADMIN_EMAILS = ["admin@exemplo.com", "elenciocalado@gmail.com"]

interface Usuario {
  id: string
  email: string
  username: string
  telefone?: string
  criadoEm: any
  produtoCount: number
}

export default function AdminSimples() {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  // Verificar se é admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "")

  // Redirecionar se não for admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/login")
    }
  }, [isAdmin, loading, router])

  // Carregar dados
  useEffect(() => {
    if (isAdmin) {
      carregarUsuarios()
    }
  }, [isAdmin])

  const carregarUsuarios = async () => {
    try {
      setCarregando(true)

      // Buscar usuários
      const usuariosSnapshot = await getDocs(query(collection(db, "usuarios"), orderBy("criadoEm", "desc")))

      // Buscar produtos (opcional - remova se não tiver)
      const produtosPorUsuario: { [key: string]: number } = {}
      try {
        const produtosSnapshot = await getDocs(collection(db, "produtos"))
        produtosSnapshot.forEach((doc) => {
          const produto = doc.data()
          const userId = produto.userId || produto.ownerId
          if (userId) {
            produtosPorUsuario[userId] = (produtosPorUsuario[userId] || 0) + 1
          }
        })
      } catch (produtoError) {
        console.log("Coleção produtos não encontrada, ignorando contagem")
      }

      // Processar usuários
      const usuariosData: Usuario[] = []
      usuariosSnapshot.forEach((doc) => {
        const userData = doc.data()
        usuariosData.push({
          id: doc.id,
          email: userData.email,
          username: userData.username,
          telefone: userData.telefone,
          criadoEm: userData.criadoEm,
          produtoCount: produtosPorUsuario[doc.id] || 0,
        })
      })

      setUsuarios(usuariosData)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      setErro("Erro ao carregar dados")
    } finally {
      setCarregando(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  const formatarData = (timestamp: any) => {
    if (!timestamp) return "Sem data"
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString("pt-BR")
    } catch {
      return "Data inválida"
    }
  }

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando Dashboard</h2>
            <p className="text-gray-600">Aguarde enquanto carregamos os dados...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 max-w-md">
            <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
            <p className="text-gray-600 mb-8">Apenas administradores podem acessar esta área.</p>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stats = {
    totalUsuarios: usuarios.length,
    totalProdutos: usuarios.reduce((sum, u) => sum + u.produtoCount, 0),
    usuariosComProdutos: usuarios.filter((u) => u.produtoCount > 0).length,
    usuariosComWhatsApp: usuarios.filter((u) => u.telefone).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">Painel de controle do sistema</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{user?.email}</span>
              </div>

              <button
                onClick={carregarUsuarios}
                disabled={carregando}
                className="flex items-center bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${carregando ? "animate-spin" : ""}`} />
                Atualizar
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsuarios}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">Total de Usuários</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{stats.totalProdutos}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">Total de Produtos</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{stats.usuariosComProdutos}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">Com Produtos</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600">{stats.usuariosComWhatsApp}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">Com WhatsApp</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <MessageCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <span className="text-red-700 font-medium">{erro}</span>
            </div>
          </div>
        )}

        {/* Lista de usuários */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Usuários Cadastrados ({usuarios.length})</h2>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Atualizado agora</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Produtos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map((usuario, index) => (
                  <tr
                    key={usuario.id}
                    className={`hover:bg-blue-50/30 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                          <span className="text-white text-sm font-bold">
                            {usuario.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">@{usuario.username}</p>
                          <p className="text-sm text-gray-600">{usuario.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {usuario.telefone ? (
                        <a
                          href={`https://wa.me/55${usuario.telefone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors group"
                        >
                          <Phone className="h-4 w-4" />
                          <span className="group-hover:underline">{usuario.telefone}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Não informado
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            usuario.produtoCount > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          {usuario.produtoCount}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatarData(usuario.criadoEm)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => window.open(`/${usuario.username}`, "_blank")}
                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium group"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Catálogo
                        <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {usuarios.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-600">Quando houver usuários cadastrados, eles aparecerão aqui.</p>
            </div>
          )}
        </div>

        {/* Insights */}
        {usuarios.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Insights Rápidos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/60 rounded-lg p-4">
                <p className="font-medium text-gray-900">Taxa de Ativação</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {Math.round((stats.usuariosComProdutos / stats.totalUsuarios) * 100)}%
                </p>
                <p className="text-gray-600 text-xs mt-1">usuários com produtos</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="font-medium text-gray-900">Média de Produtos</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.totalUsuarios > 0 ? Math.round(stats.totalProdutos / stats.totalUsuarios) : 0}
                </p>
                <p className="text-gray-600 text-xs mt-1">por usuário</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {Math.round((stats.usuariosComWhatsApp / stats.totalUsuarios) * 100)}%
                </p>
                <p className="text-gray-600 text-xs mt-1">têm WhatsApp</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
