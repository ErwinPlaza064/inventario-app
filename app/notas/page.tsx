"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiFileText, FiTrash2, FiClock } from "react-icons/fi";
import { apiFetch } from "../../lib/api";
import { ENDPOINTS } from "../../lib/config";

interface Nota {
  id: number;
  titulo: string;
  contenido: string;
  fechaCreacion: string;
}

export default function NotasPage() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nuevaNota, setNuevaNota] = useState({ titulo: "", contenido: "" });

  const fetchNotas = useCallback(async () => {
    try {
      const resp = await apiFetch(ENDPOINTS.notas);
      if (resp.ok) {
        const data = await resp.json();
        setNotas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const [error, setError] = useState(false);

  // ... (existing code)

  const guardarNota = async () => {
    if (!nuevaNota.titulo.trim() || !nuevaNota.contenido.trim()) {
      setError(true);
      return;
    }
    setError(false);
    
    // ... (existing code)
    try {
      const resp = await apiFetch(ENDPOINTS.notas, {
        method: "POST",
        body: JSON.stringify(nuevaNota)
      });
      if (resp.ok) {
        setNuevaNota({ titulo: "", contenido: "" });
        setShowModal(false);
        fetchNotas();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarNota = async (id: number) => {
    try {
      const resp = await apiFetch(`${ENDPOINTS.notas}/${id}`, {
        method: "DELETE"
      });
      if (resp.ok) fetchNotas();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  return (
    <div className="px-4 pt-24 pb-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in lg:mt-10">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 lg:mb-12 gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-black tracking-tight uppercase">NOTAS IT</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full lg:w-auto bg-black text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 relative z-10"
        >
          <FiPlus /> NUEVA NOTA
        </button>
      </header>

      {notas.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[40px]">
          <FiClock className="mx-auto text-4xl text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No hay notas guardadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notas.map((nota) => (
            <div key={nota.id} className="bg-white border-2 border-gray-100 p-8 rounded-[32px] hover:border-black transition-all group flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl text-black group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-6">
                  <FiFileText size={24} />
                </div>
                <button 
                  onClick={() => eliminarNota(nota.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 hover:text-red-500 transition-all"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
              <h3 className="text-xl font-black text-black uppercase mb-3 tracking-tight">{nota.titulo}</h3>
              <p className="text-gray-500 text-sm font-bold leading-relaxed flex-1 whitespace-pre-wrap">{nota.contenido}</p>
              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-[10px] font-black text-gray-200 uppercase tracking-[0.2em]">
                <span>#{nota.id}</span>
                <span className="text-gray-300 group-hover:text-black transition-colors underline decoration-black/10">IT SUITE</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Nota */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl relative animate-scale-up">
            <h2 className="text-3xl font-black text-black mb-8 uppercase tracking-tighter">Nueva Nota IT</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={error && !nuevaNota.titulo ? "¡El título es obligatorio!" : "Título (ej: Config Servidor)"}
                value={nuevaNota.titulo}
                onChange={(e) => {
                  setNuevaNota({...nuevaNota, titulo: e.target.value});
                  if (error) setError(false);
                }}
                className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-black font-bold outline-none transition-all ${
                  error && !nuevaNota.titulo 
                    ? "border-red-500 placeholder:text-red-400 animate-shake" 
                    : "border-gray-100 focus:bg-white focus:border-black"
                }`}
              />
              <textarea
                placeholder={error && !nuevaNota.contenido ? "¡La nota no puede estar vacía!" : "Contenido de la nota..."}
                value={nuevaNota.contenido}
                rows={5}
                onChange={(e) => {
                  setNuevaNota({...nuevaNota, contenido: e.target.value});
                  if (error) setError(false);
                }}
                className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-black font-bold outline-none resize-none transition-all ${
                  error && !nuevaNota.contenido 
                    ? "border-red-500 placeholder:text-red-400 animate-shake" 
                    : "border-gray-100 focus:bg-white focus:border-black"
                }`}
              />
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-gray-400 font-bold hover:text-black transition-colors"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={guardarNota}
                  className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200"
                >
                  GUARDAR NOTA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
