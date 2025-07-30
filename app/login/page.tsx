"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, UserPlus, LogIn, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/cadastro")
      }
    })
    return unsubscribe
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      setErro("Preencha todos os campos")
      return
    }

    setCarregando(true)
    setErro("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro no login:", error)
      setErro("Email ou senha incorretos")
    } finally {
      setCarregando(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const form = e.currentTarget.closest("form")
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar à página inicial
          </button>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-center">
              <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
              <p className="text-blue-100">Acesse sua conta e gerencie seus produtos</p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                    <Mail className="h-4 w-4 inline mr-2" />
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={carregando}
                      required
                    />
                    <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                    <Lock className="h-4 w-4 inline mr-2" />
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Sua senha"
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={carregando}
                      required
                    />
                    <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Error Message */}
                {erro && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center text-red-700">
                      <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">{erro}</span>
                    </div>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={carregando || !email || !password}
                  className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  {carregando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Entrar na minha conta
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center space-y-4">
                <p className="text-gray-600">Ainda não tem uma conta?</p>
                <button
                  onClick={() => router.push("/register")}
                  className="group w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center"
                >
                  <UserPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Criar conta gratuita
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 px-8 py-6">
              <div className="flex items-center justify-center text-green-700">
                <ShieldCheck className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">
                  Seus dados estão protegidos com criptografia de ponta a ponta
                </span>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50">
              <div className="bg-blue-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">100% Seguro</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50">
              <div className="bg-green-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <LogIn className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Acesso Rápido</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50">
              <div className="bg-purple-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Gratuito</p>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Problemas para entrar?{" "}
              <button className="text-blue-600 hover:underline font-medium">Entre em contato</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
