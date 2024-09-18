'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Patient {
  id: string
  nome: string
  email: string
  plano_saude: string
  carteira: string
  documento: string
  remedios: string
  idade: number
}

export default function PacientesMedico() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }
    checkAuth()
  }, [supabase, router])

  const handleSearch = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,documento.ilike.%${searchTerm}%`)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Error searching patients:', error)
    } else {
      setPatients(data || [])
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscar Pacientes</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, email ou documento"
          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#FF6666]"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#FF6666] focus:ring-opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      {patients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">{patient.nome}</h2>
              <p className="text-sm text-gray-600 mb-1">{patient.email}</p>
              <p className="text-sm mb-1">
                <strong>Idade:</strong> {patient.idade}
              </p>
              <p className="text-sm mb-1">
                <strong>Plano de Saúde:</strong> {patient.plano_saude}
              </p>
              <p className="text-sm mb-1">
                <strong>Carteira:</strong> {patient.carteira}
              </p>
              <p className="text-sm mb-1">
                <strong>Documento:</strong> {patient.documento}
              </p>
              <p className="text-sm">
                <strong>Remédios:</strong> {patient.remedios || 'Nenhum remédio registrado'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>{searchTerm ? 'Nenhum paciente encontrado.' : 'Use a barra de busca para encontrar pacientes.'}</p>
      )}
    </div>
  )
}