"use client"

import type React from "react"

import { useState } from "react"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth"
import { useRouter } from "next/navigation"
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore"
import { FirebaseError } from "firebase/app"
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle,
  X,
  Gift,
  Zap,
  MessageCircle,
  Globe,
} from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [username, setUsername] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [telefone, setTelefone] = useState("")

  const verificarUsername = async (username: string): Promise<boolean> => {
    const usernameQuery = query(collection(db, "usuarios"), where("username", "==", username.toLowerCase()))
    const snapshot = await getDocs(usernameQuery)
    return !snapshot.empty
  }

  const registrar = async (): Promise<void> => {
    if (!username.trim() || !email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos obrigatórios")
      return
    }

    const usernameClean = username.trim().toLowerCase()

    if (telefone && telefone.length < 10) {
      setErro("Telefone inválido. Use DDD + número.")
      return
    }

    if (usernameClean.length < 3) {
      setErro("Username deve ter pelo menos 3 caracteres")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(usernameClean)) {
      setErro("Username pode conter apenas letras, números e _")
      return
    }

    if (senha.length < 6) {
      setErro("Senha deve ter pelo menos 6 caracteres")
      return
    }

    setCarregando(true)
    setErro("")

    try {
      const usernameExiste = await verificarUsername(usernameClean)
      if (usernameExiste) {
        setErro("Username já está em uso. Escolha outro.")
        setCarregando(false)
        return
      }

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha)
      const uid = cred.user.uid

      await setDoc(doc(db, "usuarios", uid), {
        email: email.trim(),
        username: usernameClean,
        telefone: telefone.trim(),
        criadoEm: new Date(),
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Erro no registro:", error)
      if (error instanceof FirebaseError || (error as AuthError)?.code) {
        const firebaseError = error as AuthError
        switch (firebaseError.code) {
          case "auth/email-already-in-use":
            setErro("Este email já está em uso")
            break
          case "auth/invalid-email":
            setErro("Email inválido")
            break
          case "auth/weak-password":
            setErro("Senha muito fraca. Use pelo menos 6 caracteres")
            break
          case "auth/operation-not-allowed":
            setErro("Registro não permitido. Contate o suporte")
            break
          default:
            setErro("Erro ao criar conta. Tente novamente")
        }
      } else {
        setErro("Erro inesperado. Tente novamente")
      }
    } finally {
      setCarregando(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      registrar()
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, "")
    setUsername(value)
  }

  const isUsernameValid = username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)
  const isPasswordValid = senha.length >= 6

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
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
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-8 text-center">
              <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Criar Conta Gratuita</h1>
              <p className="text-green-100">Junte-se a milhares de vendedores e crie seu catálogo digital</p>
            </div>

            {/* Form */}
            <div className="p-8">
              <div className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <User className="h-4 w-4 inline mr-2" />
                    Nome de usuário *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ex: maria_store, joao_vendas"
                      className={`w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        isUsernameValid
                          ? "focus:ring-green-500 border-green-300 bg-green-50"
                          : "focus:ring-blue-500 border-gray-200 bg-gray-50 focus:bg-white"
                      }`}
                      value={username}
                      onChange={handleUsernameChange}
                      onKeyPress={handleKeyPress}
                      disabled={carregando}
                      maxLength={20}
                    />
                    <User className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    {username && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {isUsernameValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Real-time validation */}
                  {username && (
                    <div className="mt-3">
                      {username.length < 3 ? (
                        <div className="flex items-center text-red-600 text-sm">
                          <X className="h-4 w-4 mr-2" />
                          Mínimo 3 caracteres
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Username válido
                        </div>
                      )}
                    </div>
                  )}

                  {/* URL Preview */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3">
                    <div className="flex items-center text-blue-700 text-sm mb-2">
                      <Globe className="h-4 w-4 mr-2" />
                      Seu catálogo será acessível em:
                    </div>
                    <p className="font-mono text-blue-800 font-semibold bg-white rounded-lg px-3 py-2 border">
                      catalogo.com/{username || "seu_usuario"}
                    </p>
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Phone className="h-4 w-4 inline mr-2" />
                    WhatsApp (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="11999999999"
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))}
                      onKeyPress={handleKeyPress}
                      disabled={carregando}
                    />
                    <Phone className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Clientes poderão entrar em contato diretamente
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Mail className="h-4 w-4 inline mr-2" />
                    E-mail *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={carregando}
                    />
                    <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Lock className="h-4 w-4 inline mr-2" />
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        isPasswordValid
                          ? "focus:ring-green-500 border-green-300 bg-green-50"
                          : "focus:ring-blue-500 border-gray-200 bg-gray-50 focus:bg-white"
                      }`}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={carregando}
                    />
                    <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    {senha && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {isPasswordValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Password validation */}
                  {senha && (
                    <div className="mt-3">
                      {senha.length < 6 ? (
                        <div className="flex items-center text-red-600 text-sm">
                          <X className="h-4 w-4 mr-2" />
                          Mínimo 6 caracteres
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Senha segura
                        </div>
                      )}
                    </div>
                  )}
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

                {/* Register Button */}
                <button
                  onClick={registrar}
                  disabled={carregando || !username.trim() || !email.trim() || !senha.trim()}
                  className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  {carregando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Criar Conta Gratuita
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center text-green-800 mb-4">
                    <Gift className="h-5 w-5 mr-2" />
                    <h3 className="font-semibold">O que você ganha:</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center text-green-700 text-sm">
                      <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                      Catálogo online profissional
                    </div>
                    <div className="flex items-center text-green-700 text-sm">
                      <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                      Link personalizado para compartilhar
                    </div>
                    <div className="flex items-center text-green-700 text-sm">
                      <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                      Integração direta com WhatsApp
                    </div>
                    <div className="flex items-center text-green-700 text-sm">
                      <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                      100% gratuito e sem limites
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center space-y-4">
                <p className="text-gray-600">Já tem uma conta?</p>
                <button
                  onClick={() => router.push("/login")}
                  className="group w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center"
                >
                  <LogIn className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Fazer login
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-200 px-8 py-6">
              <div className="flex items-center justify-center text-blue-700">
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
              <div className="bg-green-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Setup Rápido</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50">
              <div className="bg-blue-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <Gift className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">100% Gratuito</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50">
              <div className="bg-purple-100 rounded-full p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">WhatsApp</p>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Dúvidas sobre o cadastro?{" "}
              <button className="text-blue-600 hover:underline font-medium">Entre em contato</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
