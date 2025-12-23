"use client";

import { useEffect, useState } from "react";
import { FiMenu, FiActivity, FiMessageSquare, FiArrowRight } from "react-icons/fi";
import { useSidebar } from "../../context/SidebarContext";
import { apiFetch } from "../../lib/api";
import Link from "next/link";

interface Novedad {
  id: number;
  contenido: string;
  fechaCreacion: string;
  tareaId: number;
  tareaTitulo: string;
  usuarioId: number;
}

export default function NovedadesPage() {
  const { openSidebar } = useSidebar();
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNovedades();
  }, []);

  const fetchNovedades = async () => {
    try {
      const resp = await apiFetch("/tareas/novedades");
      if (resp.ok) {
        const data = await resp.json();
        setNovedades(data);
      }
    } catch (error) {
      console.error("Error fetching feed", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return "Justo ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return "Ayer";
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in relative z-10">
      {/* Header */}
      <header className="flex items-center gap-3 mb-8 lg:mb-12">
        <button
          onClick={openSidebar}
          className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg active:scale-90 transition-transform"
        >
          <FiMenu size={20} />
        </button>
        <h1 className="text-2xl lg:text-4xl font-black text-black dark:text-white tracking-tight uppercase flex items-center gap-3">
          NOVEDADES
        </h1>
      </header>

      {/* Feed */}
      <div className="max-w-3xl mx-auto space-y-6">
        {loading ? (
           <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white rounded-full animate-spin mx-auto pb-4"/>
              <p className="text-gray-400 font-bold text-sm mt-4">Cargando actividad...</p>
           </div>
        ) : novedades.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            <FiActivity size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-400 font-bold">No hay actividad reciente.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 lg:ml-8 space-y-8 pl-8 lg:pl-12 py-4">
             {novedades.map((note, idx) => (
                <div key={note.id} className="relative animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    {/* Timeline Dot */}
                    <div className="absolute -left-[41px] lg:-left-[59px] top-6 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-4 border-black dark:border-white shadow-sm z-10"></div>
                    
                    {/* Card */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded uppercase tracking-wider">
                                    TAREA
                                </span>
                                <h3 className="font-black text-lg text-black dark:text-white line-clamp-1">
                                    {note.tareaTitulo}
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                                {formatDate(note.fechaCreacion)}
                            </span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg relative">
                             <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-50 dark:bg-gray-800/50 transform rotate-45 border-l border-t border-transparent"></div> {/* Triangle tip attempt, maybe simple bg is better */}
                             <p className="text-gray-700 dark:text-gray-300 font-medium text-sm leading-relaxed">
                                {note.contenido}
                             </p>
                        </div>
                        
                        {/* Action Link (Optional, creates nice affordance) */}
                        <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* In a real app, this would open the modal. For now, it's decorative or we could link to home with query param */}
                            <button className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-1 hover:underline">
                                Ver Tarea <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
