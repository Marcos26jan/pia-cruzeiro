"use client";

import { useState } from "react";

export default function LoginPage() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function fazerLogin(e: any) {
    e.preventDefault();

    if (senha === "pia@2025") {
      localStorage.setItem("logado", "sim");
      window.location.href = "/admin";
    } else {
      setErro("Senha incorreta!");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      {/* 🔙 Botão Voltar */}
      <button
        onClick={() => (window.location.href = "/")}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 
                   px-4 py-2 rounded-lg shadow font-semibold transition"
      >
        ← Início
      </button>

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        
        {/* 🔵 LOGO DO SISTEMA */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white font-bold text-xl px-6 py-4 rounded-lg shadow-md tracking-wide">
            PIA CRUZEIRO
          </div>
        </div>

        {/* 🔒 Ícone de cadeado */}
        <div className="text-center mb-4">
          <span className="text-5xl">🔒</span>
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Acesso Restrito
        </h1>

        <form onSubmit={fazerLogin}>
          <input
            type="password"
            placeholder="Digite a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition mb-3"
          />

          {erro && (
            <p className="text-red-600 text-sm mb-3 font-medium">{erro}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
