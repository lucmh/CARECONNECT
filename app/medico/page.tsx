'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Paciente {
  nome: string
}

interface Appointment {
  id: string
  paciente_id: string
  data_hora: string
  status: string
  paciente: Paciente
}

export default function MedicoHomePage() {
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
          paciente:perfis(nome)
        `)
        .eq('medico_id', session.user.id)
        .order('data_hora', { ascending: true })
        .limit(5)

      if (error) {
        console.error('Error fetching appointments:', error)
      } else {
        // Transform the data to match the Appointment interface
        const transformedData: Appointment[] = data?.map(item => ({
          id: item.id,
          paciente_id: item.paciente_id,
          data_hora: item.data_hora,
          status: item.status,
          paciente: {
            nome: item.paciente[0]?.nome || 'Nome não disponível'
          }
        })) || []
        setAppointments(transformedData)
      }

      setLoading(false)
    }

    fetchAppointments()
  }, [supabase, router])

  if (loading) {
    return <div className="text-center mt-8">Carregando...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo, Doutor</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-2">Próximas Consultas</h2>
          {appointments.length > 0 ? (
            <ul className="space-y-2">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="bg-white shadow rounded-lg p-4">
                  <p className="font-semibold">{appointment.paciente.nome}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.data_hora).toLocaleString()}
                  </p>
                  <p className="text-sm">Status: {appointment.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma consulta agendada.</p>
          )}
          <Link href="/medico/consultas" className="mt-4 inline-block text-[#FF6666] hover:underline">
            Ver todas as consultas
          </Link>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link href="/medico/pacientes" className="block bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded text-center">
              Buscar Pacientes
            </Link>
            <Link href="/medico/consultas" className="block bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded text-center">
              Gerenciar Consultas
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}