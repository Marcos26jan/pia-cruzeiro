"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const logado = localStorage.getItem("logado");

    if (logado !== "sim") {
      router.replace("/login"); // 🔐 redireciona se não estiver logado
    } else {
      setCarregando(false);
    }
  }, [router]);

  if (carregando) {
    return <p>Verificando acesso...</p>;
  }

  return <>{children}</>;
}
