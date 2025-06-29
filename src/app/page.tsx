"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <Image
          src="/logo-clinica.svg"
          alt="Logo da Clínica"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bem-vindo ao PsychoMentor
        </h1>
        <p className="text-gray-600 mb-6">
          Gerencie pacientes, profissionais e atendimentos de forma simples e segura.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Fazer Login
          </button>
          <button
            onClick={() => router.push("/register/paciente")}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Cadastrar como Paciente
          </button>
          <button
            onClick={() => router.push("/register/profissional")}
            className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Cadastrar como Profissional
          </button>
        </div>
      </div>
      <footer className="mt-10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} PsychoMentor. Todos os direitos reservados.
      </footer>
    </div>
  );
}
