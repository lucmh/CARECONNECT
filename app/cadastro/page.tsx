'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [planoSaude, setPlanoSaude] = useState('')
  const [carteira, setCarteira] = useState('')
  const [documento, setDocumento] = useState('')
  const [remedios, setRemedios] = useState('')
  const [idade, setIdade] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    try {
      // 1. Criar o usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Inserir o perfil do usuário
        const { error: profileError } = await supabase
          .from('perfis')
          .insert({
            id: authData.user.id,  // Usar o ID do usuário recém-criado
            nome,
            email,
            plano_saude: planoSaude,
            carteira,
            documento,
            remedios,
            idade: parseInt(idade),
          })

        if (profileError) throw profileError

        setMessage('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.')
        setTimeout(() => router.push('/'), 5000)
      }
    } catch (error: any) {
      setMessage(`Erro ao cadastrar: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastro CareConnect</h2>
        {message && (
          <div className={`mb-4 p-2 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
            <input id="nome" type="text" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input id="email" type="email" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
            <input id="senha" type="password" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <div>
            <label htmlFor="planoSaude" className="block text-sm font-medium text-gray-700">Plano de Saúde</label>
            <input id="planoSaude" type="text" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={planoSaude} onChange={(e) => setPlanoSaude(e.target.value)} />
          </div>
          <div>
            <label htmlFor="carteira" className="block text-sm font-medium text-gray-700">Carteira</label>
            <input id="carteira" type="text" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={carteira} onChange={(e) => setCarteira(e.target.value)} />
          </div>
          <div>
            <label htmlFor="documento" className="block text-sm font-medium text-gray-700">Documento</label>
            <input id="documento" type="text" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={documento} onChange={(e) => setDocumento(e.target.value)} />
          </div>
          <div>
            <label htmlFor="remedios" className="block text-sm font-medium text-gray-700">Remédios</label>
            <input id="remedios" type="text" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={remedios} onChange={(e) => setRemedios(e.target.value)} />
          </div>
          <div>
            <label htmlFor="idade" className="block text-sm font-medium text-gray-700">Idade</label>
            <input id="idade" type="number" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-gray-800" value={idade} onChange={(e) => setIdade(e.target.value)} />
          </div>
          <div>
            <button type="submit" className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF6666] hover:bg-[#FF4444]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6666]`} disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'CADASTRAR'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#FF6666] hover:text-[#FF4444]">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  )
}