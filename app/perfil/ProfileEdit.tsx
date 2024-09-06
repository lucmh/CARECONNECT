'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Profile {
  id: string
  nome: string
  email: string
  plano_saude: string
  carteira: string
  documento: string
  remedios: string
  idade: string
}

export default function ProfileEdit({ profile }: { profile: Profile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [message, setMessage] = useState('')

  const supabase = createClientComponentClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const { error } = await supabase
        .from('perfis')
        .update(formData)
        .eq('id', profile.id)

      if (error) throw error

      setMessage('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      setMessage('Erro ao atualizar o perfil. Por favor, tente novamente.')
    }
  }

  if (!isEditing) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
            required
          />
        </div>
        <div>
          <label htmlFor="plano_saude" className="block text-sm font-medium text-gray-700">Plano de Saúde</label>
          <input
            type="text"
            id="plano_saude"
            name="plano_saude"
            value={formData.plano_saude}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
          />
        </div>
        <div>
          <label htmlFor="carteira" className="block text-sm font-medium text-gray-700">Carteira</label>
          <input
            type="text"
            id="carteira"
            name="carteira"
            value={formData.carteira}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
          />
        </div>
        <div>
          <label htmlFor="documento" className="block text-sm font-medium text-gray-700">Documento</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
          />
        </div>
        <div>
          <label htmlFor="remedios" className="block text-sm font-medium text-gray-700">Remédios</label>
          <input
            type="text"
            id="remedios"
            name="remedios"
            value={formData.remedios}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
          />
        </div>
        <div>
          <label htmlFor="idade" className="block text-sm font-medium text-gray-700">Idade</label>
          <input
            type="number"
            id="idade"
            name="idade"
            value={formData.idade}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666]"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded"
          >
            Salvar Alterações
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
      {message && (
        <div className={`mt-4 p-2 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  )
}