"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiCheckCircle, FiClock, FiTrash2 } from "react-icons/fi";
import { Tarea } from "../types/task";
import { apiFetch } from "../lib/api";
import { ENDPOINTS } from "../lib/config";

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTareas = useCallback(async () => {
    try {
      const resp = await apiFetch(ENDPOINTS.tareas);
      if (resp.ok) {
        const data = await resp.json();
        setTareas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const agregarTarea = async () => {
    if (!nuevaTarea.trim()) return;
    
    try {
      const resp = await apiFetch(ENDPOINTS.tareas, {
        method: "POST",
        body: JSON.stringify({ titulo: nuevaTarea, estado: "Pendiente" })
      });

      if (resp.ok) {
        setNuevaTarea("");
        fetchTareas();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarTarea = async (id: number) => {
    try {
      const resp = await apiFetch(`${ENDPOINTS.tareas}/${id}`, {
        method: "DELETE"
      });
      if (resp.ok) fetchTareas();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null; // El layout ya muestra un spinner central

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in lg:mt-10">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-black tracking-tight uppercase">IT TASKS</h1>
        <p className="text-gray-400 font-medium tracking-tight">Centro de mando para tus tareas pendientes de TI.</p>
      </header>

      {/* Input para nueva tarea */}
      <div className="relative mb-8 group">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="¿Qué hay que hacer ahora?"
          onKeyPress={(e) => e.key === "Enter" && agregarTarea()}
          className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-5 text-black font-bold focus:border-black transition-all outline-none shadow-sm placeholder:text-gray-200"
        />
        <button 
          onClick={agregarTarea}
          className="absolute right-3 top-3 bg-black text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* Lista de Tareas */}
      <div className="space-y-3">
        {tareas.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl">
            <FiClock className="mx-auto text-3xl text-gray-200 mb-2" />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No hay tareas pendientes</p>
          </div>
        ) : (
          tareas.map((t) => (
            <div key={t.id} className="group flex items-center justify-between bg-white border border-gray-100 p-5 rounded-2xl hover:border-black transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <button className="text-gray-100 hover:text-green-500 transition-colors">
                  <FiCheckCircle size={28} />
                </button>
                <div className="flex flex-col">
                  <span className="text-black font-black uppercase tracking-tight text-sm">{t.titulo}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pendiente</span>
                </div>
              </div>
              <button 
                onClick={() => t.id && eliminarTarea(t.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 hover:text-red-500 transition-all"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
