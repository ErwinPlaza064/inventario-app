"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiPlus, FiLock, FiClock, FiKey, FiUser } from "react-icons/fi";
import { apiFetch } from "../../lib/api";
import { CredencialCard } from "../../components/CredencialCard";

interface Credencial {
  id: number;
  titulo: string;
  valor: string;
  usuario?: string;
  fechaCreacion: string;
}

export default function BovedaPage() {
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nuevaCred, setNuevaCred] = useState({
    titulo: "",
    valor: "",
    usuario: "",
  });
  const [error, setError] = useState(false);

  const fetchCredenciales = useCallback(async () => {
    try {
      const resp = await apiFetch("/credenciales");
      if (resp.ok) {
        const data = await resp.json();
        setCredenciales(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredenciales();
  }, [fetchCredenciales]);

  const guardarCredencial = async () => {
    if (!nuevaCred.titulo.trim() || !nuevaCred.valor.trim()) {
      setError(true);
      return;
    }
    setError(false);

    try {
      const resp = await apiFetch("/credenciales", {
        method: "POST",
        body: JSON.stringify(nuevaCred),
      });
      if (resp.ok) {
        setNuevaCred({ titulo: "", valor: "", usuario: "" });
        setShowModal(false);
        fetchCredenciales();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarCredencial = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta credencial?")) return;
    try {
      const resp = await apiFetch(`/credenciales/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) fetchCredenciales();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  return (
    <div className="px-4 pt-24 pb-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in lg:mt-10">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 lg:mb-12 gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-black dark:text-white tracking-tight uppercase">
            BÓVEDA DE ACCESOS
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full lg:w-auto bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-none shadow-gray-200 relative z-10"
        >
          <FiPlus /> NUEVA CLAVE
        </button>
      </header>

      {credenciales.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[40px]">
          <FiLock className="mx-auto text-4xl text-gray-200 dark:text-gray-700 mb-4" />
          <p className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-widest">
            Tu bóveda está vacía
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {credenciales.map((cred) => (
            <CredencialCard
              key={cred.id}
              {...cred}
              onDelete={eliminarCredencial}
            />
          ))}
        </div>
      )}

      {/* Modal Nueva Credencial */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-start sm:items-center justify-center pt-20 sm:pt-0 p-4 sm:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[40px] p-6 sm:p-10 shadow-2xl dark:shadow-none relative animate-scale-up">
            <h2 className="text-3xl font-black text-black dark:text-white mb-8 uppercase tracking-tighter">
              Guardar Secreto
            </h2>
            <div className="space-y-4">
              {/* Titulo */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-2">
                  Título / Referencia
                </label>
                <div className="relative">
                  <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Ej: Router Principal"
                    value={nuevaCred.titulo}
                    onChange={(e) => {
                      setNuevaCred({ ...nuevaCred, titulo: e.target.value });
                      if (error) setError(false);
                    }}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl py-4 pl-12 pr-6 text-black dark:text-white font-bold outline-none transition-all ${
                      error && !nuevaCred.titulo
                        ? "border-red-500 placeholder:text-red-400 animate-shake"
                        : "border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-black dark:focus:border-white"
                    }`}
                  />
                </div>
              </div>

              {/* Usuario (Opcional) */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-2">
                  Usuario (Opcional)
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" />
                  <input
                    type="text"
                    placeholder="Ej: admin"
                    value={nuevaCred.usuario}
                    onChange={(e) =>
                      setNuevaCred({ ...nuevaCred, usuario: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-6 text-black dark:text-white font-bold outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-black dark:focus:border-white transition-all"
                  />
                </div>
              </div>

              {/* Valor / Contraseña */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-2">
                  Contraseña / IP / Secreto
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" />
                  <input
                    type="text"
                    placeholder="******"
                    value={nuevaCred.valor}
                    onChange={(e) => {
                      setNuevaCred({ ...nuevaCred, valor: e.target.value });
                      if (error) setError(false);
                    }}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl py-4 pl-12 pr-6 text-black dark:text-white font-bold outline-none transition-all font-mono ${
                      error && !nuevaCred.valor
                        ? "border-red-500 placeholder:text-red-400 animate-shake"
                        : "border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-black dark:focus:border-white"
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-gray-400 dark:text-gray-500 font-bold hover:text-black dark:hover:text-white transition-colors"
                >
                  CANCELAR
                </button>
                <button
                  onClick={guardarCredencial}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-none shadow-gray-200"
                >
                  GUARDAR
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
