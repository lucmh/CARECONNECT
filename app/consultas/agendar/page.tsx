'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Profissional {
  id: string
  nome: string
  especialidade: string
}

export default function AgendarConsultaPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [selectedProfissional, setSelectedProfissional] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function loadProfissionais() {
      const { data, error } = await supabase
        .from('profissionais')
        .select('id, nome, especialidade')

      if (error) {
        console.error('Erro ao carregar profissionais:', error)
      } else {
        setProfissionais(data || [])
      }

      setLoading(false)
    }

    loadProfissionais()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push('/')
      return
    }

    const { data, error } = await supabase
      .from('consultas')
      .insert({
        paciente_id: session.user.id,
        medico_id: selectedProfissional,
        data_hora: dataHora,
        status: 'agendada',
        observacoes,
      })

    if (error) {
      setMessage(`Erro ao agendar consulta: ${error.message}`)
    } else {
      setMessage('Consulta agendada com sucesso!')
      setTimeout(() => router.push('/consultas'), 2000)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agendar Consulta</h1>
      {message && (
        <div className={`mb-4 p-2 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profissional" className="block text-sm font-medium text-gray-700">Profissional</label>
          <select
            id="profissional"
            value={selectedProfissional}
            onChange={(e) => setSelectedProfissional(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
          >
            <option value="">Selecione um profissional</option>
            {profissionais.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.nome} - {prof.especialidade}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dataHora" className="block text-sm font-medium text-gray-700">Data e Hora</label>
          <input
            id="dataHora"
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
          />
        </div>
        <div>
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações</label>
          <textarea
            id="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
            rows={3}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Agendar Consulta
        </button>
      </form>
    </div>
  )
}