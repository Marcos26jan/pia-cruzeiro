"use client";

import { useEffect, useState } from "react";

export default function PaginaImpressao() {
  const [dados, setDados] = useState<any[]>([]);
  const [agora, setAgora] = useState(""); // ← evita hydration mismatch

  useEffect(() => {
    // gerar data somente no cliente
    setAgora(new Date().toLocaleString("pt-BR"));

    // carregar dados salvos
    const armazenado = localStorage.getItem("dadosParaImpressao");
    if (armazenado) {
      setDados(JSON.parse(armazenado));
    }

    // acionar impressão
    setTimeout(() => window.print(), 600);
  }, []);

  // **corrige datas inválidas**
  const formatarDataSimples = (d: string | null) => {
    if (!d) return "—";

    // se for string tipo "2025-11-15"
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
    }

    // se já vier formatada
    return d;
  };

  const formatarEnviado = (valor: number | null) => {
    if (!valor) return "—";
    return new Date(valor * 1000).toLocaleString("pt-BR");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <style>
        {`
          h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 26px;
          }

          .item {
            border: 1px solid #ccc;
            padding: 14px;
            margin-bottom: 14px;
            border-radius: 8px;
            font-size: 16px;
          }

          footer {
            margin-top: 60px;
            text-align: center;
            font-size: 14px;
            color: #444;
            padding-top: 10px;
            border-top: 1px solid #aaa;
          }

          @media print {
            footer {
              position: fixed;
              bottom: 0;
              width: 100%;
              background: white;
              padding-bottom: 8px;
            }
          }
        `}
      </style>

      <h1>Lista de justificativas</h1>

      {dados.map((j, i) => (
        <div key={i} className="item">
          <p><strong>Servidor:</strong> {j.nome}</p>
          <p><strong>Data da reunião:</strong> {formatarDataSimples(j.dataReuniao)}</p>
          <p><strong>Motivo:</strong> {j.motivo}</p>
          <p><strong>Enviado em:</strong> {formatarEnviado(j.enviadoEm)}</p>
        </div>
      ))}

      <footer>📝 PIA Cruzeiro — Impresso em {agora}</footer>
    </div>
  );
}
