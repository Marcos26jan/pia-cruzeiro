"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../src/firebase/firebaseConfig";

interface Justificativa {
  id: string;
  nome: string;
  motivo: string;
  dataReuniao: string | Timestamp | null;
  enviadoEm: Timestamp;
}

function formatarData(valor: any) {
  if (!valor && valor !== 0) return "";

  if (typeof valor === "object" && typeof valor.toDate === "function") {
    const d = valor.toDate();
    return d.toLocaleDateString("pt-BR");
  }

  if (typeof valor === "string") {
    if (valor.includes("/")) return valor;

    if (valor.includes("-")) {
      const p = valor.split("-");
      if (p.length === 3 && p[0].length === 4)
        return `${p[2]}/${p[1]}/${p[0]}`;
      return `${p[0]}/${p[1]}/${p[2]}`;
    }

    return valor;
  }

  try {
    return String(valor);
  } catch {
    return "";
  }
}

function imprimirPDFTodas(lista: any[]) {
  const dataHora = new Date().toLocaleString("pt-BR");

  let conteudo = `
    <html>
      <head>
        <title>PIA Cruzeiro - Impresso em ${dataHora}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }

          .item {
            border: 1px solid #ccc;
            padding: 12px;
            margin-bottom: 15px;
            border-radius: 8px;
          }

          p { font-size: 15px; margin: 4px 0; }

          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #777;
          }

          @page {
            margin: 15mm;
          }
        </style>
      </head>
      <body>
        <h1>Lista de Justificativas</h1>
  `;

  lista.forEach((j) => {
    conteudo += `
      <div class="item">
        <p><strong>Servidor:</strong> ${j.nome}</p>
        <p><strong>Data da reunião:</strong> ${formatarData(j.dataReuniao)}</p>
        <p><strong>Motivo:</strong> ${j.motivo}</p>
        <p><strong>Enviado em:</strong> ${j.enviadoEm?.toDate().toLocaleString()}</p>
      </div>
    `;
  });

  conteudo += `
        <footer>
          PIA Cruzeiro – Impresso em ${dataHora}
        </footer>
      </body>
    </html>
  `;

  const novaJanela = window.open("", "printWindow", "width=800,height=600");

  if (!novaJanela) return;

  novaJanela.document.open();
  novaJanela.document.write(conteudo);
  novaJanela.document.close();

  // Aguarda o carregamento antes de imprimir (IMPORTANTE)
  novaJanela.onload = () => {
    novaJanela.focus();
    novaJanela.print();
  };
}


export default function AdminPage() {
  const [justificativas, setJustificativas] = useState<Justificativa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  // MODAL
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);

  async function carregarDados() {
    try {
      const querySnapshot = await getDocs(collection(db, "justificativas"));
      const lista: Justificativa[] = [];

      querySnapshot.forEach((docItem) => {
        lista.push({
          id: docItem.id,
          ...docItem.data(),
        } as Justificativa);
      });

      setJustificativas(lista);
    } catch (error) {
      console.error("Erro ao carregar justificativas:", error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // ⭐ FILTRO MELHORADO
  const resultadosFiltrados = justificativas.filter((j) => {
    const termo = busca.toLowerCase();

    const nome = j.nome.toLowerCase();
    const motivo = j.motivo.toLowerCase();
    const dataFormatada = formatarData(j.dataReuniao).toLowerCase();

    return (
      nome.includes(termo) ||
      motivo.includes(termo) ||
      dataFormatada.includes(termo)
    );
  });

  // 🗑 FUNÇÃO DELETAR SEM ALERT
  async function apagarDeFato() {
    const temFiltro = busca.trim() !== "";
    const listaParaApagar = temFiltro ? resultadosFiltrados : justificativas;

    try {
      for (const j of listaParaApagar) {
        await deleteDoc(doc(db, "justificativas", j.id));
      }

      setMostrarModal(false);
      setModalSucesso(true);
      carregarDados();
    } catch (err) {
      console.error("Erro ao apagar:", err);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans relative mt-14">

{/* NAVBAR IGUAL À DA PÁGINA DE REGISTRO DE AUSÊNCIAS */}
<nav className="fixed top-0 left-0 w-full bg-[#003366] shadow-lg z-50">
  <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between text-white">

    {/* LOGO + TEXTO */}
    <div className="flex items-center gap-3">
      <div className="bg-white px-3 py-1 rounded-md shadow text-[#003366] font-bold tracking-wide">
        PIA CRUZEIRO
      </div>

      <h1 className="text-lg font-semibold tracking-wide">
      Lista de justificativas
      </h1>
    </div>

    {/* BOTÃO LOGOUT */}
    <button
  onClick={() => {
    localStorage.removeItem("logado");
    window.location.href = "/login";
  }}
  className="
    bg-white text-[#003366] font-semibold px-4 py-2 rounded-lg shadow 
    transition-all duration-300 ease-out
    hover:bg-gray-100 hover:scale-105 hover:shadow-lg
    active:scale-95
  "
>
  Logout
</button>


  </div>
</nav>


      {/* CAMPO DE BUSCA */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
          🔍
        </span>
        <input
          type="text"
          placeholder="Buscar por nome, motivo ou data..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* BOTÕES */}
      <div className="flex gap-3 mb-6">
<button
  onClick={() => {
    const listaPreparada = resultadosFiltrados.map((j) => ({
      ...j,
      enviadoEm: j.enviadoEm?.seconds ?? null,
      dataReuniao: j.dataReuniao instanceof Timestamp
        ? j.dataReuniao.toDate().toLocaleDateString("pt-BR")
        : formatarData(j.dataReuniao)
    }));

    localStorage.setItem("dadosParaImpressao", JSON.stringify(listaPreparada));
    window.open("/imprimir", "_blank");
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition flex items-center gap-2"
>
  🖨️ Imprimir PDF
</button>


        <button
          onClick={() => setMostrarModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-semibold transition flex items-center gap-2"
        >
          🗑️ Limpar
        </button>
      </div>

      {carregando && <p className="text-gray-600">Carregando...</p>}

      {!carregando && resultadosFiltrados.length === 0 && (
        <p className="text-gray-500">Nenhuma justificativa encontrada.</p>
      )}

      {/* LISTA */}
      <ul className="space-y-4">
        {resultadosFiltrados.map((j) => (
          <li
            key={j.id}
            className="p-5 bg-white rounded-xl shadow-md border border-gray-200"
          >
            <p className="text-lg">
              <strong className="text-gray-700">👤 Nome:</strong> {j.nome}
            </p>

            <p className="mt-1">
              <strong className="text-gray-700">📅 Data reunião:</strong>{" "}
              {formatarData(j.dataReuniao)}
            </p>

            <p className="mt-1">
              <strong className="text-gray-700">📝 Motivo:</strong> {j.motivo}
            </p>

            <p className="mt-1">
              <strong className="text-gray-700">⏱ Enviado em:</strong>{" "}
              {j.enviadoEm?.toDate().toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {/* MODAL DE CONFIRMAÇÃO */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Confirmar exclusão
            </h2>

            <p className="text-gray-600 mb-6">
              Tem certeza que deseja apagar{" "}
              <strong>TODAS</strong> as justificativas exibidas na tela?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>

              <button
                onClick={apagarDeFato}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO */}
      {modalSucesso && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm">
            <h2 className="text-xl font-bold text-green-700 mb-3">
              ✔ Sucesso
            </h2>
            <p className="text-gray-700 mb-6">
              Justificativas apagadas com sucesso!
            </p>

            <button
              onClick={() => setModalSucesso(false)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
