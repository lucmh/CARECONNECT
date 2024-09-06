'use client'

import React, { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Profile {
  id: string
  nome: string
  email: string
  plano_saude: string
  carteira: string
  documento: string
  remedios: string
  idade: number
}

interface ProfileEditProps {
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ profile, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Profile>(profile)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProfile(prev => ({ ...prev, [name]: name === 'idade' ? parseInt(value) || 0 : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('perfis')
        .update(editedProfile)
        .eq('id', profile.id)

      if (error) throw error

      setProfile(editedProfile)
      setMessage('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error: any) {
      setMessage(`Erro ao atualizar o perfil: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    if (!editedProfile.email.includes('@')) {
      setMessage('Por favor, insira um email válido.')
      return false
    }
    if (editedProfile.idade < 0 || editedProfile.idade > 120) {
      setMessage('Por favor, insira uma idade válida.')
      return false
    }
    return true
  }

  const handleCancel = () => {
    if (JSON.stringify(editedProfile) !== JSON.stringify(profile)) {
      if (window.confirm('Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas.')) {
        setEditedProfile(profile)
        setIsEditing(false)
      }
    } else {
      setIsEditing(false)
    }
  }

  if (!isEditing) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded"
        >
          Editar Perfil
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Editar Perfil</h2>
      {message && (
        <div className={`mb-4 p-2 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={editedProfile.nome}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedProfile.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="plano_saude" className="block text-sm font-medium text-gray-700">Plano de Saúde</label>
          <input
            type="text"
            id="plano_saude"
            name="plano_saude"
            value={editedProfile.plano_saude}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="carteira" className="block text-sm font-medium text-gray-700">Carteira</label>
          <input
            type="text"
            id="carteira"
            name="carteira"
            value={editedProfile.carteira}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="documento" className="block text-sm font-medium text-gray-700">Documento</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={editedProfile.documento}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="remedios" className="block text-sm font-medium text-gray-700">Remédios</label>
          <input
            type="text"
            id="remedios"
            name="remedios"
            value={editedProfile.remedios}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-black"
          />
        </div>
        <div>
          <label htmlFor="idade" className="block text-sm font-medium text-gray-700">Idade</label>
          <input
            type="number"
            id="idade"
            name="idade"
            value={editedProfile.idade}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6666] focus:border-[#FF6666] text-black"
            required
            min="0"
            max="120"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
}

export default ProfileEdit