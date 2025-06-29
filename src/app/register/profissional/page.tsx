"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IMaskInput } from "react-imask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfissionalPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [registro, setRegistro] = useState("");
  const [area, setArea] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [senha, setSenha] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => /.+@.+\..+/.test(email);

  const validateSenha = (senha: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(senha);

  const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === Number(cpf[10]);
  };

  const validateDataNascimento = (data: Date | null) => {
    if (!data) return false;
    const hoje = new Date();
    const dataLimpa = new Date(data);
    hoje.setHours(0, 0, 0, 0);
    dataLimpa.setHours(0, 0, 0, 0);
    return dataLimpa.getTime() !== hoje.getTime();
  };

  const getSenhaRequisitos = (senha: string) => {
    const requisitos: string[] = [];
    if (senha.length < 8) requisitos.push("mínimo 8 caracteres");
    if (!/[A-Z]/.test(senha)) requisitos.push("1 letra maiúscula");
    if (!/[a-z]/.test(senha)) requisitos.push("1 letra minúscula");
    if (!/[0-9]/.test(senha)) requisitos.push("1 número");
    if (!/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(senha))
      requisitos.push("1 símbolo(@, #, * , &)");
    return requisitos;
  };

  // ✅ Adicionado aqui
  const requisitosSenha = getSenhaRequisitos(senha);

  useEffect(() => {
    if (cpf.length === 14) {
      if (!validarCPF(cpf)) {
        setErrors((prev) => ({ ...prev, cpf: "CPF inválido." }));
      } else {
        setErrors((prev) => {
          const { cpf, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [cpf]);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = "Email inválido. Ex: usuario@dominio.com";
    }

    if (!validateSenha(senha)) {
      newErrors.senha =
        "Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 símbolo.";
    }

    if (!validateDataNascimento(dataNascimento)) {
      newErrors.dataNascimento = "Data de nascimento não pode ser hoje.";
    }

    if (!validarCPF(cpf)) {
      newErrors.cpf = "CPF inválido.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      nome,
      cpf,
      email,
      telefone,
      registro,
      area,
      especialidade,
      senha,
      dataNascimento: dataNascimento?.toISOString().split("T")[0],
    };
    console.log(payload, "Estou aqui");
    try {
      const response = await fetch("http://localhost:8080/api/profissional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao cadastrar:", errorData);
        alert("Erro ao cadastrar profissional. Verifique os dados.");
        return;
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro na comunicação com o servidor.");
    }
  };

  const handleRedirect = (type: "paciente" | "profissional") => {
    router.push(`/register/${type}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-100 p-6">
      <div className="bg-gray-700 p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">
          Cadastro de Profissional
        </h1>

        <form
          className="flex flex-col gap-4 bg-white p-4 rounded"
          onSubmit={handleCadastro}
        >
          <div>
            <label
              htmlFor="nome"
              className="block text-gray-700 font-medium mb-1"
            >
              Nome
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border text-black border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="block text-gray-700 font-medium mb-1"
            >
              CPF
            </label>
            <IMaskInput
              mask="000.000.000-00"
              value={cpf}
              onAccept={(value: string) => setCpf(value)}
              className={`w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 ${
                errors.cpf
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-blue-500"
              }`}
              required
            />
            {errors.cpf && (
              <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="dataNascimento"
              className="block text-gray-700 font-medium mb-1"
            >
              Data de Nascimento
            </label>
            <DatePicker
              selected={dataNascimento}
              onChange={(date: Date) => setDataNascimento(date)}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              filterDate={(date) => {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);
                return date.getTime() !== hoje.getTime();
              }}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Selecione a data"
              className={`w-full border rounded px-3 py-2 focus:outline-none text-black focus:ring-2 ${
                errors.dataNascimento
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-blue-500"
              }`}
              required
            />
            {errors.dataNascimento && (
              <p className="text-red-600 text-sm mt-1">
                {errors.dataNascimento}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none text-black focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-blue-500"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="block text-gray-700 font-medium mb-1"
            >
              Telefone
            </label>
            <input
              id="telefone"
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full border text-black border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="registro"
              className="block text-gray-700 font-medium mb-1"
            >
              Registro Médico
            </label>
            <input
              id="registro"
              type="text"
              value={registro}
              onChange={(e) => setRegistro(e.target.value)}
              className="w-full border text-black border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="area"
              className="block text-gray-700 font-medium mb-1"
            >
              Área
            </label>
            <input
              id="area"
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full border text-black border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="area"
              className="block text-gray-700 font-medium mb-1"
            >
              Especialidade
            </label>
            <input
              id="especialidade"
              type="text"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              className="w-full border text-black border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

            <div>
            <label
              htmlFor="senha"
              className="block text-gray-700 font-medium mb-1"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none text-black focus:ring-2 ${
                errors.senha
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-blue-500"
              }`}
              required
            />
            {errors.senha && (
              <p className="text-red-600 text-sm mt-1">{errors.senha}</p>
            )}
            {senha && requisitosSenha.length > 0 && (
              <ul className="text-sm text-orange-600 mt-2 list-disc list-inside">
                {requisitosSenha.map((item, idx) => (
                  <li key={idx}>Falta: {item}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Cadastrar
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => handleRedirect("paciente")}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Ir para cadastro de Paciente
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
          >
            Voltar para Login
          </button>
        </div>
      </div>
    </main>
  );
}
