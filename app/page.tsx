"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [nome, setNome] = useState("");
  const [motivo, setMotivo] = useState("");
  const [dataReuniao, setDataReuniao] = useState("");
  const [enviando, setEnviando] = useState(false);

  // MODAL DE ALERTA (erro ou sucesso)
  const [modalMsg, setModalMsg] = useState<{
    tipo: "erro" | "sucesso" | null;
    texto: string;
  }>({ tipo: null, texto: "" });

  // MODAL DE CONFIRMAÇÃO
  const [confirmarEnvio, setConfirmarEnvio] = useState(false);

  function abrirModal(tipo: "erro" | "sucesso", texto: string) {
    setModalMsg({ tipo, texto });
  }

  function fecharModal() {
    setModalMsg({ tipo: null, texto: "" });
  }

  // FORMATA A DATA
  function formatarData(e: any) {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
    if (valor.length > 5) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    setDataReuniao(valor);
  }

  // CLICK NO BOTÃO "ENVIAR" → ABRE MODAL DE CONFIRMAÇÃO
  function tentarEnviar(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim() || !motivo.trim() || !dataReuniao.trim()) {
      abrirModal("erro", "Preencha todos os campos.");
      return;
    }

    setConfirmarEnvio(true); // abre modal
  }

  // CONFIRMAR ENVIO → SALVA NO FIRESTORE
  async function enviar() {
    setConfirmarEnvio(false);
    setEnviando(true);

    try {
      await addDoc(collection(db, "justificativas"), {
        nome,
        motivo,
        dataReuniao,
        enviadoEm: Timestamp.now(),
      });

      setNome("");
      setMotivo("");
      setDataReuniao("");

      abrirModal("sucesso", "Justificativa enviada com sucesso!");
    } catch (err) {
      abrirModal("erro", "Erro ao enviar. Tente novamente.");
      console.error(err);
    }

    setEnviando(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-20">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 shadow-md z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-base sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <span className="text-4xl">📝</span>
            JUSTIFICATIVAS DE AUSÊNCIA
          </h1>

          <button
            onClick={() => (window.location.href = "/admin")}
            className="px-4 py-2 rounded-lg font-semibold text-blue-900 bg-blue-200 hover:bg-blue-300 transition shadow-md"
          >
            Área Administrativa
          </button>
        </div>
      </header>

      {/* MODAL DE ALERTA (ERRO OU SUCESSO) */}
      {modalMsg.tipo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 text-center">

            <h2
              className={`text-xl font-bold mb-4 ${
                modalMsg.tipo === "erro" ? "text-red-600" : "text-green-600"
              }`}
            >
              {modalMsg.tipo === "erro" ? "⚠ Erro" : "✅ Sucesso"}
            </h2>

            <p className="text-gray-700 mb-6">{modalMsg.texto}</p>

            <button
              onClick={fecharModal}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmarEnvio && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 text-center">

            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Confirmar Envio?
            </h2>

            <p className="text-gray-700 mb-6">
              Deseja realmente enviar esta justificativa?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmarEnvio(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>

              <button
                onClick={enviar}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Enviar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CARD */}
      <div className="bg-white shadow-xl rounded-xl p-6 sm:p-10 w-full max-w-xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-xl shadow-md text-center">
          <div className="bg-white text-blue-700 font-black rounded-lg px-6 py-2 text-lg shadow inline-block">
            Justificar ausência
          </div>
          <p className="text-blue-100 mt-2 text-sm">
            Informe seu nome, a data da reunião e o motivo da ausência.
          </p>
        </div>

        <form onSubmit={tentarEnviar} className="space-y-4 mt-6">

          {/* Nome */}
          <div className="flex items-center border rounded-lg bg-gray-50">
            <UserIcon className="h-6 w-6 text-gray-500 ml-3" />
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 bg-transparent outline-none"
            />
          </div>

          {/* Data */}
          <div className="flex items-center border rounded-lg bg-gray-50">
            <CalendarDaysIcon className="h-6 w-6 text-gray-500 ml-3" />
            <input
              type="text"
              placeholder="Data da reunião (dd/mm/aaaa)"
              maxLength={10}
              value={dataReuniao}
              onChange={formatarData}
              className="w-full p-3 bg-transparent outline-none"
            />
          </div>

          {/* Motivo */}
          <textarea
            placeholder="Motivo da ausência"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 min-h-[120px] outline-none"
          />

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={enviando}
            className={`w-full py-3 rounded-lg text-white font-bold transition 
              ${enviando ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {enviando ? "Enviando..." : "Enviar Justificativa"}
          </button>
        </form>

      </div>
    </main>
  );
}
