import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileDisplay from './ProfileDisplay'
import ProfileEdit from './ProfileEdit'

export default async function PerfilPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('perfis')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
      <ProfileDisplay profile={profile} />
      <ProfileEdit profile={profile} />
    </div>
  )
}