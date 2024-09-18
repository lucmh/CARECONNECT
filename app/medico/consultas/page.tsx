'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Paciente {
  nome: string
  email: string
}

interface Appointment {
  id: string
  paciente_id: string
  data_hora: string
  status: string
  observacoes: string
  paciente: Paciente
}

export default function ConsultasMedico() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchAppointments() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('consultas')
        .select(`
          id,
          paciente_id,
          data_hora,
          status,
          observacoes,
          paciente:perfis(nome, email)
        `)
        .eq('medico_id', session.user.id)
        .order('data_hora', { ascending: true })

      if (error) {
        console.error('Error fetching appointments:', error)
      } else {
        const transformedData: Appointment[] = data?.map(item => ({
          id: item.id,
          paciente_id: item.paciente_id,
          data_hora: item.data_hora,
          status: item.status,
          observacoes: item.observacoes,
          paciente: {
            nome: item.paciente[0]?.nome || 'Nome não disponível',
            email: item.paciente[0]?.email || 'Email não disponível'
          }
        })) || []
        setAppointments(transformedData)
      }

      setLoading(false)
    }

    fetchAppointments()
  }, [supabase, router])

  if (loading) {
    return <div className="text-center mt-8">Carregando consultas...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Consultas</h1>
      {appointments.length === 0 ? (
        <p>Nenhuma consulta agendada.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">{appointment.paciente.nome}</h2>
              <p className="text-sm text-gray-600 mb-1">{appointment.paciente.email}</p>
              <p className="text-sm mb-1">
                <strong>Data:</strong> {new Date(appointment.data_hora).toLocaleString()}
              </p>
              <p className="text-sm mb-1">
                <strong>Status:</strong> {appointment.status}
              </p>
              <p className="text-sm">
                <strong>Observações:</strong> {appointment.observacoes || 'Nenhuma observação'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}