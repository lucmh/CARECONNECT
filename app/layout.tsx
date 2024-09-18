'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [isProfissional, setIsProfissional] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data: profissional } = await supabase
          .from('profissionais')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setIsProfissional(!!profissional)

        // Redirect logic
        if (!!profissional && pathname === '/perfil') {
          router.push('/medico')
        } else if (!profissional && pathname === '/medico') {
          router.push('/perfil')
        }
      } else if (pathname !== '/login' && pathname !== '/cadastro') {
        router.push('/login')
      }
    }

    getUser()
  }, [supabase, router, pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsProfissional(false)
    router.push('/')
  }

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100 text-black">
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-6 py-3">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-xl font-bold text-[#FF6666]">
                CareConnect
              </Link>
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    {isProfissional ? (
                      <>
                        <Link href="/medico" className="text-black hover:text-[#FF6666]">
                          Dashboard
                        </Link>
                        <Link href="/medico/consultas" className="text-black hover:text-[#FF6666]">
                          Consultas
                        </Link>
                        <Link href="/medico/pacientes" className="text-black hover:text-[#FF6666]">
                          Pacientes
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/perfil" className="text-black hover:text-[#FF6666]">
                          Perfil
                        </Link>
                        <Link href="/consultas" className="text-black hover:text-[#FF6666]">
                          Consultas
                        </Link>
                        <Link href="/mapa" className="text-black hover:text-[#FF6666]">
                          Mapa
                        </Link>
                      </>
                    )}
                    <Link href="/assistente" className="text-black hover:text-[#FF6666]">
                      AI Chat
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-[#FF6666] hover:bg-[#FF4444] text-white font-bold py-2 px-4 rounded"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-black hover:text-[#FF6666]">
                      Login
                    </Link>
                    <Link href="/cadastro" className="text-black hover:text-[#FF6666]">
                      Cadastro
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="bg-white shadow-md mt-8">
          <div className="container mx-auto px-6 py-3 text-center text-black">
            © 2024 CareConnect. Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  )
}