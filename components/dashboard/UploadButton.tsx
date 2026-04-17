"use client";

import { useState } from "react";
import { Zap, CheckCircle, XCircle, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export function UploadButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setStatus("error");
      setMessage("Apenas arquivos .csv são aceitos.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(`${json.count} cursos importados com sucesso.`);
        // Revalida a página via router sem reload forçado
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setStatus("error");
        setMessage(json.error ?? "Erro ao processar arquivo.");
      }
    } catch {
      setStatus("error");
      setMessage("Erro de conexão. Tente novamente.");
    }

    // Reset após 4s
    setTimeout(() => { setStatus("idle"); setMessage(""); }, 4000);
    // Reset file input
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <label className="bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-300 transition-all cursor-pointer shadow-lg shadow-black/10">
        {status === "loading" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : status === "success" ? (
          <CheckCircle size={14} className="text-green-400" />
        ) : status === "error" ? (
          <XCircle size={14} className="text-red-400" />
        ) : (
          <Zap size={14} />
        )}
        <span className="hidden sm:inline">
          {status === "loading" ? "Processando..." : "Upload CSV"}
        </span>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          disabled={status === "loading"}
          onChange={handleUpload}
        />
      </label>
      {message && (
        <p className={`text-[10px] font-medium ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
