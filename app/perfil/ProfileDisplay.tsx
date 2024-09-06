import React from 'react'

interface Profile {
  nome: string
  email: string
  plano_saude: string
  carteira: string
  documento: string
  remedios: string
  idade: number
}

interface ProfileDisplayProps {
  profile: Profile
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Informações do Perfil</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-black">Nome:</p>
          <p className="text-black">{profile.nome}</p>
        </div>
        <div>
          <p className="font-semibold text-black">E-mail:</p>
          <p className="text-black">{profile.email}</p>
        </div>
        <div>
          <p className="font-semibold text-black">Plano de Saúde:</p>
          <p className="text-black">{profile.plano_saude}</p>
        </div>
        <div>
          <p className="font-semibold text-black">Carteira:</p>
          <p className="text-black">{profile.carteira}</p>
        </div>
        <div>
          <p className="font-semibold text-black">Documento:</p>
          <p className="text-black">{profile.documento}</p>
        </div>
        <div>
          <p className="font-semibold text-black">Remédios:</p>
          <p className="text-black">{profile.remedios || 'Nenhum'}</p>
        </div>
        <div>
          <p className="font-semibold text-black">Idade:</p>
          <p className="text-black">{profile.idade}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileDisplay