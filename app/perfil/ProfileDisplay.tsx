'use client'

import { useState } from 'react'

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

export default function ProfileDisplay({ profile }: { profile: Profile }) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Nome:</p>
          <p>{profile.nome}</p>
        </div>
        <div>
          <p className="font-medium">E-mail:</p>
          <p>{profile.email}</p>
        </div>
        <div>
          <p className="font-medium">Plano de Saúde:</p>
          <p>{profile.plano_saude}</p>
        </div>
        <div>
          <p className="font-medium">Carteira:</p>
          <p>{profile.carteira}</p>
        </div>
        <div>
          <p className="font-medium">Documento:</p>
          <p>{profile.documento}</p>
        </div>
        <div>
          <p className="font-medium">Remédios:</p>
          <p>{profile.remedios}</p>
        </div>
        <div>
          <p className="font-medium">Idade:</p>
          <p>{profile.idade}</p>
        </div>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded"
      >
        Editar Perfil
      </button>
    </div>
  )
}