'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Profile {
  id: string
  nome: string
  plano_saude: string
  carteira: string
  documento: string
  remedios: string
  idade: string
}

export default function Perfil() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
      } else {
        setProfile(data)
      }
    } else {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!profile) {
    return <div className="flex-1 flex items-center justify-center">Carregando...</div>
  }

  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p><strong>Nome:</strong> {profile.nome}</p>
        <p><strong>Plano de Saúde:</strong> {profile.plano_saude}</p>
        <p><strong>Carteira:</strong> {profile.carteira}</p>
        <p><strong>Documento:</strong> {profile.documento}</p>
        <p><strong>Remédios:</strong> {profile.remedios || 'Nenhum'}</p>
        <p><strong>Idade:</strong> {profile.idade}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 bg-[#FF9999] text-white px-4 py-2 rounded-full hover:bg-[#FF7777] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9999]"
      >
        Sair
      </button>
    </div>
  )
}