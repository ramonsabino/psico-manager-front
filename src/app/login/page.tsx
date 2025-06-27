'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login com:', email, senha)
  }

  const handleRedirect = (type: 'paciente' | 'profissional') => {
    router.push(`/register/${type}`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-200 p-6">
      <div className="bg-gray-600 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">PsicoManager</h1>

        <form className="flex flex-col gap-4 bg-white p-4 rounded" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-gray-700 font-medium mb-1">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-white mt-6">Ainda não tem conta?</p>
        <div className="flex flex-col gap-2 mt-2">
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            onClick={() => handleRedirect('paciente')}
          >
            Cadastrar como Paciente
          </button>
          <button
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            onClick={() => handleRedirect('profissional')}
          >
            Cadastrar como Profissional
          </button>
        </div>
      </div>
    </main>
  )
}
