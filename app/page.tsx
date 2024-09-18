import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-[#FF6666]">Bem-vindo ao CareConnect</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Conectando você aos melhores cuidados de saúde. Agende consultas, gerencie seu perfil de saúde e muito mais.
      </p>
      <div className="space-x-4">
        <Link href="/login" className="bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded">
          Login
        </Link>
        <Link href="/cadastro" className="bg-white hover:bg-gray-100 text-[#FF6666] font-bold py-2 px-4 rounded border border-[#FF6666]">
          Cadastro
        </Link>
      </div>
    </div>
  )
}