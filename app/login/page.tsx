'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (error) throw error

      setMessage('Login realizado com sucesso!')
      router.push('/perfil')
    } catch (error: any) {
      console.error('Login error:', error)
      setMessage(`Erro ao fazer login: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login CareConnect</h2>
        {message && (
          <div className={`mb-4 p-2 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input id="email" type="email" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
            <input id="senha" type="password" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <div>
            <button type="submit" className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF6666] hover:bg-[#FF4444]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6666]`} disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <Link href="/cadastro" className="text-sm text-[#FF6666] hover:text-[#FF4444]">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  )
}