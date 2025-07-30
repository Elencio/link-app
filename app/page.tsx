'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ShoppingBag, Zap, DollarSign, MessageCircle, Star, ArrowRight, CheckCircle, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [carregando, setCarregando] = useState(false)

  const abrirCatalogo = async () => {
    const usernameClean = username.trim().toLowerCase()
    
    if (usernameClean) {
      setCarregando(true)
      try {
        router.push(`/${usernameClean}`)
      } catch (error) {
        console.error('Erro na navegação:', error)
        setCarregando(false)
      }
    } else {
      alert('Digite um nome de usuário para ver o catálogo')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      abrirCatalogo()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CatálogoDigital</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#recursos" className="text-gray-600 hover:text-gray-900 transition-colors">Recursos</a>
              <a href="#depoimentos" className="text-gray-600 hover:text-gray-900 transition-colors">Depoimentos</a>
              <button 
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Entrar
              </button>
              <button 
                onClick={() => router.push('/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
            <Star className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">Mais de 10.000 catálogos criados</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Seu catálogo digital
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              profissional e gratuito
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transforme sua lista de produtos em um catálogo digital elegante. 
            Aumente suas vendas e profissionalize seu negócio em minutos.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-12">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              100% Gratuito
            </div>
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Sem Mensalidades
            </div>
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              WhatsApp Integrado
            </div>
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Responsivo
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => router.push('/register')}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Zap className="h-5 w-5 mr-2" />
              Criar Catálogo Gratuito
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Já tenho conta
            </button>
          </div>
        </div>

        {/* Search Catalog */}
        <div className="max-w-lg mx-auto mb-20">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <Search className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Buscar Catálogo
              </h2>
              <p className="text-gray-600">Digite o nome do usuário para visualizar o catálogo</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nome do usuário
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: maria_store, joao_vendas"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg bg-gray-50 focus:bg-white"
                    disabled={carregando}
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
                {username && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      🔗 <span className="font-medium">Buscando:</span> <span className="font-mono">catalogo.com/{username.toLowerCase()}</span>
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={abrirCatalogo}
                disabled={carregando || !username.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 text-lg group"
              >
                {carregando ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Carregando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search className="h-5 w-5 mr-2" />
                    Abrir Catálogo
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher nosso catálogo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desenvolvido especialmente para pequenos e médios negócios que querem vender mais
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Rápido e Intuitivo
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Configure seu catálogo completo em menos de 5 minutos. Interface simples e intuitiva, sem complicações.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Completamente Gratuito
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sem taxas ocultas, sem mensalidades, sem limites. Todos os recursos disponíveis gratuitamente para sempre.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                WhatsApp Integrado
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Seus clientes entram em contato diretamente pelo WhatsApp com apenas um clique. Vendas mais rápidas e fáceis.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Catálogos criados</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-blue-100">Produtos cadastrados</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">200%</div>
                <div className="text-blue-100">Aumento médio nas vendas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-gray-600">
              Histórias reais de quem transformou seu negócio
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-full p-3 mr-4">
                  <span className="text-white text-lg font-bold">MS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Maria Silva</div>
                  <div className="text-sm text-gray-600">Doces Artesanais</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;Minhas vendas triplicaram depois que criei meu catálogo. Os clientes adoram poder ver todos os doces organizados e fazer pedidos pelo WhatsApp.&quot;
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full p-3 mr-4">
                  <span className="text-white text-lg font-bold">JS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">João Santos</div>
                  <div className="text-sm text-gray-600">Moda Masculina</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;Profissionalizei minha loja sem gastar nada. O catálogo ficou lindo e meus clientes sempre elogiam a organização dos produtos.&quot;
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-3 mr-4">
                  <span className="text-white text-lg font-bold">AL</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Ana Lima</div>
                  <div className="text-sm text-gray-600">Cosméticos</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;Super fácil de usar! Em 10 minutos já tinha meu catálogo pronto. A integração com WhatsApp é perfeita para receber pedidos.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para revolucionar suas vendas?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de empreendedores que já transformaram seus negócios com nosso catálogo digital
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push('/register')}
              className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Criar Meu Catálogo Agora
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-center text-sm opacity-75">
            <CheckCircle className="h-4 w-4 mr-2" />
            Configuração em menos de 5 minutos
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CatálogoDigital</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 CatálogoDigital. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
