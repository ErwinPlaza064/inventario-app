
import { useState, useEffect } from "react";
import { FiX, FiTrash2, FiSave, FiClock, FiAlignLeft } from "react-icons/fi";
import { Tarea, TaskStatus } from "../types/task";

interface TaskModalProps {
  task: Tarea;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updates: Partial<Tarea>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TaskModal = ({ task, isOpen, onClose, onSave, onDelete }: TaskModalProps) => {
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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative animate-scale-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-8 border-b border-gray-100">
           <div className="flex-1 mr-8">
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full text-2xl lg:text-3xl font-black text-black bg-transparent border-2 border-transparent hover:border-gray-100 focus:border-black rounded-lg px-2 py-1 outline-none transition-all"
                placeholder="Título de la tarea"
              />
              <div className="flex items-center gap-2 mt-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <FiClock />
                <span>Creada el {new Date(task.fechaCreacion).toLocaleDateString()}</span>
              </div>
           </div>
           
           <button 
             onClick={onClose}
             className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all transform hover:rotate-90"
           >
             <FiX size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
          
          {/* Status Selector */}
          <div className="space-y-3">
             <label className="text-xs font-black uppercase text-gray-300 tracking-widest ml-1">Estado Actual</label>
             <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl w-fit">
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
                    {s === "EnProceso" ? "Por Hacer" : s === "Completada" ? "Resuelto" : s}
                  </button>
                ))}
             </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
             <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-300 tracking-widest ml-1">
                <FiAlignLeft /> Descripción
             </label>
             <textarea
               value={descripcion}
               onChange={(e) => setDescripcion(e.target.value)}
               placeholder="Añade una descripción más detallada..."
               className="w-full min-h-[200px] bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl p-6 text-black font-medium leading-relaxed outline-none transition-all resize-none"
             />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between gap-4 bg-gray-50/50 rounded-b-[32px]">
           <button 
             onClick={handleDelete}
             className="px-6 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all flex items-center gap-2"
             disabled={loading}
           >
             <FiTrash2 /> ELIMINAR
           </button>
           
           <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-8 py-4 font-bold text-gray-400 hover:text-black transition-colors"
                disabled={loading}
              >
                CANCELAR
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-4 bg-black text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-300 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? "GUARDANDO..." : <><FiSave /> GUARDAR CAMBIOS</>}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};
