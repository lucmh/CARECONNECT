'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Consulta {
  id: string
  paciente_id: string
  medico_id: string
  data_hora: string
  status: string
  observacoes: string
}

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [isProfissional, setIsProfissional] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function loadConsultas() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
        return
      }

      const { data: userProfile } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const { data: profissionalProfile } = await supabase
        .from('profissionais')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setIsProfissional(!!profissionalProfile)

      const { data: consultasData, error } = await supabase
        .from('consultas')
        .select('*')
        .eq(isProfissional ? 'medico_id' : 'paciente_id', session.user.id)

      if (error) {
        console.error('Erro ao carregar consultas:', error)
      } else {
        setConsultas(consultasData || [])
      }

      setLoading(false)
    }

    loadConsultas()
  }, [supabase, router, isProfissional])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Consultas</h1>
      {consultas.length === 0 ? (
        <p>Nenhuma consulta encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {consultas.map((consulta) => (
            <li key={consulta.id} className="bg-white shadow rounded-lg p-4">
              <p><strong>Data e Hora:</strong> {new Date(consulta.data_hora).toLocaleString()}</p>
              <p><strong>Status:</strong> {consulta.status}</p>
              <p><strong>Observações:</strong> {consulta.observacoes || 'Nenhuma observação'}</p>
            </li>
          ))}
        </ul>
      )}
      {!isProfissional && (
        <button
          onClick={() => router.push('/consultas/agendar')}
          className="mt-4 bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded"
        >
          Agendar Nova Consulta
        </button>
      )}
    </div>
  )
}