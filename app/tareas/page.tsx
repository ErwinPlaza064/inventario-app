"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiMenu,
  FiMonitor,
  FiCode,
  FiWifi,
  FiFileText,
  FiTool,
  FiSearch,
  FiFilter,
  FiX,
  FiAlertCircle,
  FiCalendar,
} from "react-icons/fi";
import {
  Tarea,
  TaskStatus,
  TaskCategory,
  TaskPriority,
  CATEGORIES,
  PRIORITIES,
  detectCategory,
} from "../../types/task";
import { apiFetch } from "../../lib/api";
import { ENDPOINTS } from "../../lib/config";
import { TaskModal } from "../../components/TaskModal";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";

export default function TareasPage() {
  const { openSidebar } = useSidebar();

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Tarea | null>(null);

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<
    TaskCategory | "Todas"
  >("Todas");
  const [filtroPrioridad, setFiltroPrioridad] = useState<
    TaskPriority | "Todas"
  >("Todas");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const COLUMNS = [
    { id: "Pendiente", label: "PENDIENTE", color: "bg-gray-100 text-gray-500" },
    { id: "EnProceso", label: "POR HACER", color: "bg-blue-50 text-blue-600" },
    {
      id: "Completada",
      label: "RESUELTO",
      color: "bg-green-50 text-green-600",
    },
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
          estado:
            typeof t.estado === "number"
              ? ["Pendiente", "EnProceso", "Completada"][t.estado]
              : t.estado,
          categoria:
            typeof t.categoria === "number"
              ? [
                  "Hardware",
                  "Software",
                  "Redes",
                  "Documentacion",
                  "Mantenimiento",
                ][t.categoria]
              : t.categoria || "Hardware",
          prioridad:
            typeof t.prioridad === "number"
              ? ["Baja", "Media", "Alta", "Urgente"][t.prioridad]
              : t.prioridad || "Media",
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
      // Auto-detectar categoría basada en el título
      const categoria = detectCategory(nuevaTarea);
      const categoriaEnum = [
        "Hardware",
        "Software",
        "Redes",
        "Documentacion",
        "Mantenimiento",
      ].indexOf(categoria);

      const resp = await apiFetch(ENDPOINTS.tareas, {
        method: "POST",
        body: JSON.stringify({
          titulo: nuevaTarea,
          estado: 0,
          categoria: categoriaEnum,
          prioridad: 1, // Media por defecto
        }),
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
        method: "DELETE",
      });
      if (resp.ok) fetchTareas();
    } catch (err) {
      console.error(err);
    }
  };

  const updateEstado = async (id: number, nuevoEstado: TaskStatus) => {
    // Optimistic Update
    const previousTareas = [...tareas];
    setTareas(
      tareas.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
    );

    try {
      // Backend espera número: Pendiente=0, EnProceso=1, Completada=2
      const estadoEnum = ["Pendiente", "EnProceso", "Completada"].indexOf(
        nuevoEstado
      );
      const tarea = tareas.find((t) => t.id === id);

      // Convertir categoría a número también
      const categoriaEnum = tarea?.categoria
        ? [
            "Hardware",
            "Software",
            "Redes",
            "Documentacion",
            "Mantenimiento",
          ].indexOf(tarea.categoria)
        : 0;

      const resp = await apiFetch(`${ENDPOINTS.tareas}/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...tarea,
          estado: estadoEnum,
          categoria: categoriaEnum,
          id,
        }),
      });

      if (!resp.ok) {
        setTareas(previousTareas); // Revertir si falla
      }
    } catch (err) {
      setTareas(previousTareas);
      console.error(err);
    }
  };

  // --- Task Updates ---
  const handleSaveTask = async (id: number, updates: Partial<Tarea>) => {
    // Optimistic Update
    const previousTareas = [...tareas];
    setTareas(tareas.map((t) => (t.id === id ? { ...t, ...updates } : t)));

    try {
      const tarea = tareas.find((t) => t.id === id);
      if (!tarea) return;

      const updatedTarea = { ...tarea, ...updates };

      // Convert status string to enum int if necessary
      let estadoEnum =
        typeof updatedTarea.estado === "string"
          ? ["Pendiente", "EnProceso", "Completada"].indexOf(
              updatedTarea.estado as string
            )
          : updatedTarea.estado;

      // Convert category string to enum int
      let categoriaEnum = updatedTarea.categoria
        ? [
            "Hardware",
            "Software",
            "Redes",
            "Documentacion",
            "Mantenimiento",
          ].indexOf(updatedTarea.categoria as string)
        : 0;

      // Convert priority string to enum int
      let prioridadEnum = updatedTarea.prioridad
        ? ["Baja", "Media", "Alta", "Urgente"].indexOf(
            updatedTarea.prioridad as string
          )
        : 1;

      const payload = {
        ...updatedTarea,
        estado: estadoEnum,
        categoria: categoriaEnum,
        prioridad: prioridadEnum,
      };

      const resp = await apiFetch(`${ENDPOINTS.tareas}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        setTareas(previousTareas);
        alert("Error al guardar cambios"); // Fallback simple
      } else {
        fetchTareas();
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

  // Función para filtrar tareas
  const tareasFiltradas = tareas.filter((tarea) => {
    // Filtro de búsqueda
    const matchSearch =
      searchTerm === "" ||
      tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tarea.descripcion &&
        tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtro de categoría
    const matchCategoria =
      filtroCategoria === "Todas" || tarea.categoria === filtroCategoria;

    // Filtro de prioridad
    const matchPrioridad =
      filtroPrioridad === "Todas" || tarea.prioridad === filtroPrioridad;

    return matchSearch && matchCategoria && matchPrioridad;
  });

  if (loading) return null;

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in h-dvh flex flex-col">
      <header className="mb-6 lg:mb-8 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={openSidebar}
              className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg active:scale-90 transition-transform"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="text-2xl lg:text-4xl font-black text-black dark:text-white tracking-tight uppercase">
              IT TASKS
            </h1>
          </div>
          <div className="flex gap-2 w-full lg:w-auto items-center">
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => {
                setNuevaTarea(e.target.value);
                if (error) setError(false);
              }}
              placeholder={error ? "¡Escribe algo!" : "Nueva Tarea..."}
              onKeyPress={(e) => e.key === "Enter" && agregarTarea()}
              className={`bg-gray-50 dark:bg-gray-900 border-2 rounded-lg px-3 py-2 text-black dark:text-white font-bold outline-none flex-1 lg:w-64 transition-all text-sm ${
                error
                  ? "border-red-500 placeholder:text-red-400 animate-shake"
                  : "border-gray-100 dark:border-gray-800 focus:border-black dark:focus:border-white"
              }`}
            />
            <button
              onClick={agregarTarea}
              className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tareas..."
              className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm font-bold outline-none focus:border-black dark:focus:border-white transition-all"
            />
          </div>

          {/* Botón de filtros */}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              mostrarFiltros ||
              filtroCategoria !== "Todas" ||
              filtroPrioridad !== "Todas"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FiFilter size={16} />
            Filtros
            {(filtroCategoria !== "Todas" || filtroPrioridad !== "Todas") && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-black shadow-lg animate-bounce">
                {(filtroCategoria !== "Todas" ? 1 : 0) +
                  (filtroPrioridad !== "Todas" ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Panel de filtros */}
        {mostrarFiltros && (
          <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-lg p-4 animate-scale-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro de Categoría */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">
                  Categoría
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) =>
                    setFiltroCategoria(e.target.value as TaskCategory | "Todas")
                  }
                  className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-lg p-2 text-sm font-bold outline-none focus:border-black dark:focus:border-white transition-all"
                >
                  <option value="Todas">Todas</option>
                  {Object.keys(CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORIES[cat as TaskCategory].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de Prioridad */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">
                  Prioridad
                </label>
                <select
                  value={filtroPrioridad}
                  onChange={(e) =>
                    setFiltroPrioridad(e.target.value as TaskPriority | "Todas")
                  }
                  className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-lg p-2 text-sm font-bold outline-none focus:border-black dark:focus:border-white transition-all"
                >
                  <option value="Todas">Todas</option>
                  {Object.keys(PRIORITIES).map((pri) => (
                    <option key={pri} value={pri}>
                      {PRIORITIES[pri as TaskPriority].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Limpiar filtros */}
            {(filtroCategoria !== "Todas" || filtroPrioridad !== "Todas") && (
              <button
                onClick={() => {
                  setFiltroCategoria("Todas");
                  setFiltroPrioridad("Todas");
                }}
                className="mt-3 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
              >
                <FiX size={14} />
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-y-auto lg:overflow-x-auto pb-4 lg:pb-0">
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-full w-full lg:min-w-[1000px]">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[32px] flex flex-col h-auto lg:h-full lg:max-h-[calc(100vh-200px)] shrink-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-black rounded-t-[30px]">
                <h2 className="font-black text-sm tracking-widest uppercase text-gray-400 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${col.color
                      .split(" ")[0]
                      .replace("text", "bg")
                      .replace("50", "400")}`}
                  />
                  {col.label}
                </h2>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold">
                  {tareasFiltradas.filter((t) => t.estado === col.id).length}
                </span>
              </div>

              {/* Tasks Container */}
              <div className="p-4 space-y-3 lg:overflow-y-auto flex-1 custom-scrollbar">
                {tareasFiltradas.filter((t) => t.estado === col.id).length ===
                  0 && (
                  <div className="text-center py-10 opacity-30">
                    <p className="text-xs font-bold uppercase text-gray-400">
                      {searchTerm ||
                      filtroCategoria !== "Todas" ||
                      filtroPrioridad !== "Todas"
                        ? "Sin resultados"
                        : "Vacío"}
                    </p>
                  </div>
                )}

                {tareasFiltradas
                  .filter((t) => t.estado === col.id)
                  .map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => t.id && handleDragStart(e, t.id)}
                      onClick={() => setSelectedTask(t)}
                      className="bg-white dark:bg-gray-900 p-5 rounded-2xl border-2 border-transparent shadow-sm hover:shadow-lg hover:border-black dark:hover:border-white cursor-pointer active:scale-95 transition-all group relative animate-scale-up"
                    >
                      <p className="text-black dark:text-white font-bold text-sm mb-3 leading-snug">
                        {t.titulo}
                      </p>

                      {t.descripcion && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {t.descripcion}
                          </p>
                        </div>
                      )}

                      {/* Prioridad y Fecha de vencimiento */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {/* Prioridad */}
                        {t.prioridad && (
                          <span
                            className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 ${
                              PRIORITIES[t.prioridad].badgeColor
                            }`}
                          >
                            <FiAlertCircle size={10} />
                            {PRIORITIES[t.prioridad].label}
                          </span>
                        )}

                        {/* Fecha de vencimiento */}
                        {t.fechaVencimiento &&
                          (() => {
                            const hoy = new Date();
                            hoy.setHours(0, 0, 0, 0);
                            const vencimiento = new Date(t.fechaVencimiento);
                            vencimiento.setHours(0, 0, 0, 0);
                            const diffDias = Math.ceil(
                              (vencimiento.getTime() - hoy.getTime()) /
                                (1000 * 60 * 60 * 24)
                            );
                            const esVencida = diffDias < 0;
                            const esHoy = diffDias === 0;
                            const esManana = diffDias === 1;
                            const esProxima = diffDias > 1 && diffDias <= 3;

                            return (
                              <span
                                className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-sm ${
                                  esVencida
                                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse"
                                    : esHoy
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                                    : esManana
                                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                                    : esProxima
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                }`}
                              >
                                <FiCalendar size={10} />
                                {esVencida
                                  ? "¡Vencida!"
                                  : esHoy
                                  ? "Hoy"
                                  : esManana
                                  ? "Mañana"
                                  : `${diffDias}d`}
                              </span>
                            );
                          })()}
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`relative px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${col.color} cursor-pointer group/badge transition-all hover:brightness-95`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {col.id}
                            {/* Mobile Dropdown Fallback */}
                            <select
                              value={t.estado}
                              onChange={(e) =>
                                updateEstado(
                                  t.id!,
                                  e.target.value as TaskStatus
                                )
                              }
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="EnProceso">Por Hacer</option>
                              <option value="Completada">Resuelto</option>
                            </select>
                          </div>
                          {/* Category Badge */}
                          {t.categoria &&
                            CATEGORIES[t.categoria] &&
                            (() => {
                              const iconMap: Record<string, React.ReactNode> = {
                                FiMonitor: <FiMonitor size={10} />,
                                FiCode: <FiCode size={10} />,
                                FiWifi: <FiWifi size={10} />,
                                FiFileText: <FiFileText size={10} />,
                                FiTool: <FiTool size={10} />,
                              };
                              return (
                                <span
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                                    CATEGORIES[t.categoria!].color
                                  }`}
                                >
                                  {iconMap[CATEGORIES[t.categoria!].iconName]}{" "}
                                  {CATEGORIES[t.categoria!].label}
                                </span>
                              );
                            })()}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                            <FiClock size={12} />
                            <span>
                              {new Date(
                                t.fechaCreacion || Date.now()
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
          onDelete={async (id) => {
            await eliminarTarea(id);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
