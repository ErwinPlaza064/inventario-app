import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiTrash2, FiSave, FiClock, FiAlignLeft, FiTag, FiMonitor, FiCode, FiWifi, FiFileText, FiTool, FiMessageSquare, FiSend, FiAlertCircle, FiCalendar } from "react-icons/fi";
import { Tarea, TaskStatus, TaskCategory, TaskPriority, CATEGORIES, PRIORITIES } from "../types/task";
import { Comentario } from "../types/comment";
import { apiFetch } from "../lib/api";

interface TaskModalProps {
  task: Tarea;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updates: Partial<Tarea>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TaskModal = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: TaskModalProps) => {
  const [titulo, setTitulo] = useState(task.titulo);
  const [descripcion, setDescripcion] = useState(task.descripcion || "");
  const [estado, setEstado] = useState<TaskStatus>(task.estado);
  const [categoria, setCategoria] = useState<TaskCategory>(task.categoria || "Hardware");
  const [prioridad, setPrioridad] = useState<TaskPriority>(task.prioridad || "Media");
  const [fechaVencimiento, setFechaVencimiento] = useState(task.fechaVencimiento || "");
  const [loading, setLoading] = useState(false);
  
  // Comments State
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loadingComentarios, setLoadingComentarios] = useState(false);

  // Reset state when task changes
  useEffect(() => {
    setTitulo(task.titulo);
    setDescripcion(task.descripcion || "");
    setEstado(task.estado);
    setCategoria(task.categoria || "Hardware");
    setPrioridad(task.prioridad || "Media");
    setFechaVencimiento(task.fechaVencimiento || "");
    if (task.id) {
        fetchComentarios(task.id);
    }
  }, [task]);

  const fetchComentarios = async (taskId: number) => {
    setLoadingComentarios(true);
    try {
        const resp = await apiFetch(`/tareas/${taskId}/comentarios`);
        if (resp.ok) {
            const data = await resp.json();
            setComentarios(data);
        }
    } catch (error) {
        console.error("Error fetching comments", error);
    } finally {
        setLoadingComentarios(false);
    }
  };

  const handlePostComentario = async () => {
    if (!nuevoComentario.trim()) return;

    try {
        const resp = await apiFetch(`/tareas/${task.id}/comentarios`, {
            method: "POST",
            body: JSON.stringify({ contenido: nuevoComentario })
        });

        if (resp.ok) {
            setNuevoComentario("");
            fetchComentarios(task.id!);
        }
    } catch (error) {
        console.error("Error posting comment", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave(task.id!, { 
      titulo, 
      descripcion, 
      estado, 
      categoria,
      prioridad,
      fechaVencimiento: fechaVencimiento || undefined
    });
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta tarea?")) {
      setLoading(true);
      await onDelete(task.id!);
      setLoading(false);
      onClose();
    }
  };

  const iconMap: Record<string, React.ReactNode> = {
    FiMonitor: <FiMonitor size={14} />,
    FiCode: <FiCode size={14} />,
    FiWifi: <FiWifi size={14} />,
    FiFileText: <FiFileText size={14} />,
    FiTool: <FiTool size={14} />,
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-lg shadow-2xl relative animate-scale-up flex flex-col max-h-[90vh] my-auto border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex justify-between items-start p-8 border-b border-gray-100 dark:border-gray-800">
          <div className="flex-1 mr-8">
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full text-2xl lg:text-3xl font-black text-black dark:text-white bg-transparent border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700 focus:border-black dark:focus:border-white rounded-lg px-2 py-1 outline-none transition-all"
              placeholder="Título de la tarea"
            />
            <div className="flex items-center gap-2 mt-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <FiClock />
              <span>
                Creada el{" "}
                {new Date(
                  task.fechaCreacion || Date.now()
                ).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all transform hover:rotate-90"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
          <div className="space-y-8">
            {/* Status Selector */}
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest ml-1">
                Estado Actual
              </label>
              <div className="flex flex-wrap gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg w-fit">
                {["Pendiente", "EnProceso", "Completada"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setEstado(s as TaskStatus)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                      estado === s
                        ? "bg-black text-white shadow-lg"
                        : "text-gray-400 hover:text-black hover:bg-white"
                    }`}
                  >
                    {s === "EnProceso"
                      ? "Por Hacer"
                      : s === "Completada"
                      ? "Resuelto"
                      : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest ml-1">
                <FiTag /> Categoría
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400">
                  {iconMap[CATEGORIES[categoria].iconName]}
                </div>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as TaskCategory)}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 pl-10 rounded-lg text-sm font-bold outline-none cursor-pointer text-black dark:text-white appearance-none border-2 border-transparent focus:border-black dark:focus:border-white transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {Object.entries(CATEGORIES).map(([key, config]) => (
                    <option key={key} value={key} className="text-black bg-white dark:bg-gray-800">
                       {config.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {/* Priority and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest ml-1">
                  <FiAlertCircle /> Prioridad
                </label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as TaskPriority)}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm font-bold outline-none cursor-pointer text-black dark:text-white appearance-none border-2 border-transparent focus:border-black dark:focus:border-white transition-all"
                >
                  {Object.entries(PRIORITIES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest ml-1">
                  <FiCalendar /> Vencimiento
                </label>
                <input
                  type="date"
                  value={fechaVencimiento ? new Date(fechaVencimiento).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFechaVencimiento(e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm font-bold outline-none text-black dark:text-white border-2 border-transparent focus:border-black dark:focus:border-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest ml-1">
              <FiAlignLeft /> Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Añade una descripción más detallada..."
              className="w-full min-h-[150px] bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-black dark:focus:border-white rounded-lg p-6 text-black dark:text-white font-medium leading-relaxed outline-none transition-all resize-none"
            />
          </div>

          {/* Activity Log (Bitácora) */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
             <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest ml-1">
              <FiMessageSquare /> Bitácora de Actividad
            </label>
            
            <div className="max-h-[300px] overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {comentarios.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No hay actividad registrada aún.</p>
                ) : (
                    comentarios.map((c) => (
                        <div key={c.id} className="flex gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-xs font-black text-gray-500">
                                IT
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg rounded-tl-none">
                                <p className="text-black dark:text-gray-200 font-medium">{c.contenido}</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wide">
                                    {new Date(c.fechaCreacion).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handlePostComentario()}
                    placeholder="Escribe una actualización..."
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white rounded-lg px-4 py-3 text-sm font-bold outline-none transition-all"
                />
                <button 
                    onClick={handlePostComentario}
                    disabled={!nuevoComentario.trim()}
                    className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                    <FiSend />
                </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <button
              onClick={handleDelete}
              className="order-3 sm:order-1 px-4 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
              disabled={loading}
            >
              <FiTrash2 /> ELIMINAR
            </button>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-black rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg dark:shadow-none flex items-center justify-center gap-2 text-sm"
                disabled={loading}
              >
                {loading ? (
                  "GUARDANDO..."
                ) : (
                  <>
                    <FiSave /> GUARDAR CAMBIOS
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 font-bold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors text-sm"
                disabled={loading}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isOpen && typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};
