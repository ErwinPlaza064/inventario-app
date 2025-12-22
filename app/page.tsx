"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiCheckCircle, FiClock, FiTrash2 } from "react-icons/fi";
import { Tarea, TaskStatus } from "../types/task";
import { apiFetch } from "../lib/api";
import { ENDPOINTS } from "../lib/config";

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [loading, setLoading] = useState(true);

  // Columnas del Kanban
  const COLUMNS = [
    { id: "Pendiente", label: "PENDIENTE", color: "bg-gray-100 text-gray-500" },
    { id: "EnProceso", label: "POR HACER", color: "bg-blue-50 text-blue-600" },
    { id: "Completada", label: "RESUELTO", color: "bg-green-50 text-green-600" }
  ];

  const fetchTareas = useCallback(async () => {
    try {
      const resp = await apiFetch(ENDPOINTS.tareas);
      if (resp.ok) {
        const data = await resp.json();
        // Mapear el enum numérico a string si viene como número
        // 0 -> Pendiente, 1 -> EnProceso, 2 -> Completada
        const mappedData = data.map((t: any) => ({
          ...t,
          estado: typeof t.estado === 'number' 
            ? ["Pendiente", "EnProceso", "Completada"][t.estado] 
            : t.estado
        }));
        setTareas(mappedData);
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

  const [error, setError] = useState(false);

  // ... (existing code)

  const agregarTarea = async () => {
    if (!nuevaTarea.trim()) {
      setError(true);
      return;
    }
    setError(false);
    
    try {
      const resp = await apiFetch(ENDPOINTS.tareas, {
        method: "POST",
        body: JSON.stringify({ titulo: nuevaTarea, estado: 0 }) // 0 = Pendiente
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
      const resp = await apiFetch(`${ENDPOINTS.tareas}/${id}`, { method: "DELETE" });
      if (resp.ok) fetchTareas();
    } catch (err) {
      console.error(err);
    }
  };

  const updateEstado = async (id: number, nuevoEstado: TaskStatus) => {
    // Optimistic Update
    const previousTareas = [...tareas];
    setTareas(tareas.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));

    try {
      // Backend espera número: Pendiente=0, EnProceso=1, Completada=2
      const estadoEnum = ["Pendiente", "EnProceso", "Completada"].indexOf(nuevoEstado);
      const tarea = tareas.find(t => t.id === id);
      
      const resp = await apiFetch(`${ENDPOINTS.tareas}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...tarea, estado: estadoEnum, id })
      });

      if (!resp.ok) {
        setTareas(previousTareas); // Revertir si falla
      }
    } catch (err) {
      setTareas(previousTareas);
      console.error(err);
    }
  };

  // --- HTML5 Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("taskId", id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necesario para permitir el drop
  };

  const handleDrop = (e: React.DragEvent, columnaId: string) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("taskId"));
    if (id) {
      updateEstado(id, columnaId as TaskStatus);
    }
  };

  if (loading) return null;

  return (
    <div className="px-4 pt-24 pb-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in lg:mt-10 h-dvh flex flex-col">
      <header className="mb-6 lg:mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-black tracking-tight uppercase">IT TASKS</h1>
          <p className="text-gray-400 font-medium tracking-tight text-sm lg:text-base">Tablero Kanban</p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => {
              setNuevaTarea(e.target.value);
              if (error) setError(false);
            }}
            placeholder={error ? "¡Escribe algo!" : "Nueva Tarea..."}
            onKeyPress={(e) => e.key === "Enter" && agregarTarea()}
            className={`bg-gray-50 border-2 rounded-xl px-4 py-3 text-black font-bold outline-none flex-1 lg:w-64 transition-all ${
              error 
                ? "border-red-500 placeholder:text-red-400 animate-shake" 
                : "border-gray-100 focus:border-black"
            }`}
          />
          <button 
            onClick={agregarTarea}
            className="bg-black text-white p-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-y-auto lg:overflow-x-auto pb-4 lg:pb-0">
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-full w-full lg:min-w-[1000px]">
          {COLUMNS.map((col) => (
            <div 
              key={col.id}
              className="flex-1 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col h-auto lg:h-full lg:max-h-[calc(100vh-200px)] shrink-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-[30px]">
                <h2 className="font-black text-sm tracking-widest uppercase text-gray-400 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${col.color.split(" ")[0].replace("text", "bg").replace("50", "400")}`} />
                  {col.label}
                </h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold">
                  {tareas.filter(t => t.estado === col.id).length}
                </span>
              </div>

              {/* Tasks Container */}
              <div className="p-4 space-y-3 lg:overflow-y-auto flex-1 custom-scrollbar">
                {tareas.filter(t => t.estado === col.id).length === 0 && (
                   <div className="text-center py-10 opacity-30">
                     <p className="text-xs font-bold uppercase text-gray-400">Vacío</p>
                   </div>
                )}
                
                {tareas
                  .filter(t => t.estado === col.id)
                  .map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => t.id && handleDragStart(e, t.id)}
                      className="bg-white p-5 rounded-2xl border-2 border-transparent shadow-sm hover:shadow-lg hover:border-black cursor-grab active:cursor-grabbing transition-all group relative animate-scale-up"
                    >
                      <p className="text-black font-bold text-sm mb-3 leading-snug">{t.titulo}</p>
                      
                      <div className="flex justify-between items-center mt-2">
                         <div className={`relative px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${col.color} cursor-pointer group/badge transition-all hover:brightness-95`}>
                           {col.id}
                           {/* Mobile Dropdown Fallback */}
                           <select
                              value={t.estado}
                              onChange={(e) => updateEstado(t.id!, e.target.value as TaskStatus)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                           >
                             <option value="Pendiente">Pendiente</option>
                             <option value="EnProceso">Por Hacer</option>
                             <option value="Completada">Resuelto</option>
                           </select>
                         </div>
                         <button 
                            onClick={() => t.id && eliminarTarea(t.id)}
                            className="text-gray-200 hover:text-red-500 transition-colors p-1"
                          >
                            <FiTrash2 size={16} />
                          </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
