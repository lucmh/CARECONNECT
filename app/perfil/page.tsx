'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import ProfileDisplay from './ProfileDisplay'
import ProfileEdit from './ProfileEdit'

export default function PerfilPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
        return
      }

      const { data: profile } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfile(profile)
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-black mb-4">Perfil do Usuário</h1>
      {profile ? (
        <>
          <ProfileDisplay profile={profile} />
          <ProfileEdit profile={profile} setProfile={setProfile} />
        </>
      ) : (
        <p>Perfil não encontrado.</p>
      )}
    </div>
  )
}