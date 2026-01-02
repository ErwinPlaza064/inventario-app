"use client";

import { useEffect, useState } from "react";
import {
  FiMenu,
  FiActivity,
  FiPlus,
  FiEdit,
  FiCheckCircle,
  FiTrash2,
  FiMessageSquare,
  FiFileText,
  FiLock,
} from "react-icons/fi";
import { useSidebar } from "../../context/SidebarContext";
import { apiFetch } from "../../lib/api";

type TipoActividad =
  | "TareaCreada"
  | "TareaActualizada"
  | "TareaCompletada"
  | "TareaEliminada"
  | "ComentarioAgregado"
  | "NotaCreada"
  | "NotaActualizada"
  | "NotaEliminada"
  | "CredencialCreada"
  | "CredencialEliminada";

interface Actividad {
  id: number;
  tipo: TipoActividad;
  descripcion: string;
  referenciaId?: number;
  referenciaInfo?: string;
  fechaCreacion: string;
}

export default function NovedadesPage() {
  const { openSidebar } = useSidebar();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    try {
      const resp = await apiFetch("/actividades");
      if (resp.ok) {
        const data = await resp.json();
        setActividades(data);
      }
    } catch (error) {
      console.error("Error fetching actividades", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (tipo: TipoActividad) => {
    switch (tipo) {
      case "TareaCreada":
        return <FiPlus className="w-4 h-4" />;
      case "TareaActualizada":
        return <FiEdit className="w-4 h-4" />;
      case "TareaCompletada":
        return <FiCheckCircle className="w-4 h-4" />;
      case "TareaEliminada":
        return <FiTrash2 className="w-4 h-4" />;
      case "ComentarioAgregado":
        return <FiMessageSquare className="w-4 h-4" />;
      case "NotaCreada":
      case "NotaActualizada":
      case "NotaEliminada":
        return <FiFileText className="w-4 h-4" />;
      case "CredencialCreada":
      case "CredencialEliminada":
        return <FiLock className="w-4 h-4" />;
      default:
        return <FiActivity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (tipo: TipoActividad) => {
    switch (tipo) {
      case "TareaCreada":
      case "NotaCreada":
      case "CredencialCreada":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "TareaCompletada":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "TareaActualizada":
      case "NotaActualizada":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "TareaEliminada":
      case "NotaEliminada":
      case "CredencialEliminada":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "ComentarioAgregado":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getActivityLabel = (tipo: TipoActividad) => {
    const labels: Record<TipoActividad, string> = {
      TareaCreada: "TAREA CREADA",
      TareaActualizada: "TAREA ACTUALIZADA",
      TareaCompletada: "TAREA COMPLETADA",
      TareaEliminada: "TAREA ELIMINADA",
      ComentarioAgregado: "COMENTARIO",
      NotaCreada: "NOTA CREADA",
      NotaActualizada: "NOTA ACTUALIZADA",
      NotaEliminada: "NOTA ELIMINADA",
      CredencialCreada: "CREDENCIAL CREADA",
      CredencialEliminada: "CREDENCIAL ELIMINADA",
    };
    return labels[tipo] || "ACTIVIDAD";
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
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 font-bold text-sm mt-4">
              Cargando actividad...
            </p>
          </div>
        ) : actividades.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            <FiActivity
              size={48}
              className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
            />
            <p className="text-gray-400 font-bold">
              No hay actividad reciente.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Línea de tiempo solo en escritorio */}
            <div className="hidden md:block absolute left-3 top-0 h-full w-[2px] bg-gray-200 dark:bg-gray-800" aria-hidden />

            <div className="space-y-6">
              {actividades.map((actividad, idx) => {
                const isComment = actividad.tipo === "ComentarioAgregado";

                return (
                  <div
                    key={actividad.id}
                    className="relative md:pl-12 animate-slide-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Punto de la línea */}
                    <div className="hidden md:block absolute left-1 top-9 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-[3px] border-black dark:border-white shadow" aria-hidden />

                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                        <span
                          className={`text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider inline-flex items-center gap-1.5 ${getActivityColor(
                            actividad.tipo
                          )}`}
                        >
                          {getActivityIcon(actividad.tipo)}
                          {getActivityLabel(actividad.tipo)}
                        </span>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                          {formatDate(actividad.fechaCreacion)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        {actividad.referenciaInfo && (
                          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-relaxed break-words whitespace-pre-wrap">
                            {actividad.referenciaInfo}
                          </h3>
                        )}

                        {isComment ? (
                          <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-lg">
                            <p className="text-gray-900 dark:text-gray-100 font-medium text-sm leading-relaxed break-words whitespace-pre-wrap">
                              {actividad.descripcion}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {actividad.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
