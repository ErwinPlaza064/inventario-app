import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiTrash2, FiSave, FiClock, FiAlignLeft } from "react-icons/fi";
import { Tarea, TaskStatus } from "../types/task";

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
  const [loading, setLoading] = useState(false);

  // Reset state when task changes
  useEffect(() => {
    setTitulo(task.titulo);
    setDescripcion(task.descripcion || "");
    setEstado(task.estado);
  }, [task]);

  const handleSave = async () => {
    setLoading(true);
    await onSave(task.id!, { titulo, descripcion, estado });
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

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl relative animate-scale-up flex flex-col max-h-[90vh] my-auto">
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
          {/* Status Selector */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest ml-1">
              Estado Actual
            </label>
            <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-2xl w-fit">
              {["Pendiente", "EnProceso", "Completada"].map((s) => (
                <button
                  key={s}
                  onClick={() => setEstado(s as TaskStatus)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
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

          {/* Description */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest ml-1">
              <FiAlignLeft /> Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Añade una descripción más detallada..."
              className="w-full min-h-[200px] bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-black dark:focus:border-white rounded-2xl p-6 text-black dark:text-white font-medium leading-relaxed outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl">
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
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg dark:shadow-none flex items-center justify-center gap-2 text-sm"
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
                className="px-6 py-3 font-bold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors text-sm"
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
