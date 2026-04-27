"use client";

import { Settings, User, Bell, Shield, Database, Trash2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { resetAndImportCSVAction } from "@/app/actions/debug.actions";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">Gerencie sua conta e preferências do sistema.</p>
      </div>

      <div className="bg-white border border-border rounded-xl divide-y divide-border overflow-hidden shadow-sm">
        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <User className="text-zinc-500" />
            <div>
              <p className="font-medium text-zinc-900">Perfil do Coordenador</p>
              <p className="text-xs text-muted-foreground">Nome, email e cargo na instituição.</p>
            </div>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:underline">Editar</button>
        </div>
        
        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <Database className="text-zinc-500" />
            <div>
              <p className="font-medium text-zinc-900">Dados da Instituição</p>
              <p className="text-xs text-muted-foreground">CNPJ, Nome e Cursos vinculados.</p>
            </div>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:underline">Gerenciar</button>
        </div>

        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <Shield className="text-zinc-500" />
            <div>
              <p className="font-medium text-zinc-900">Segurança e Tokens</p>
              <p className="text-xs text-muted-foreground">Chaves de API para integração com IA.</p>
            </div>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:underline">Configurar</button>
        </div>

        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <Trash2 className="text-red-500" />
            <div>
              <p className="font-medium text-zinc-900">Limpar e Reiniciar Dados</p>
              <p className="text-xs text-muted-foreground text-red-500">Atenção: Isso apagará todos os dados atuais e reimportará do enade-import.csv.</p>
            </div>
          </div>
          <ResetButton />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button 
          onClick={() => {
            localStorage.removeItem("authenticated");
            window.location.href = "/login";
          }}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all border border-red-100"
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}
function ResetButton() {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!confirm("Tem certeza que deseja apagar todos os dados e reiniciar pelo CSV? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      setLoading(true);
      const res = await resetAndImportCSVAction();
      if (res.success) {
        alert("Sistema reiniciado com sucesso!");
        window.location.reload();
      } else {
        alert("Erro: " + res.error);
      }
    } catch (error) {
      alert("Falha crítica ao resetar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleReset}
      disabled={loading}
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50"
    >
      {loading ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Database className="w-4 h-4" />}
      {loading ? "Processando..." : "Resetar e Reimportar"}
    </button>
  );
}
