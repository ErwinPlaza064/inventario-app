"use client";

import { FiX, FiAlertTriangle, FiTrash2 } from "react-icons/fi";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isSubmitting?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isSubmitting = false
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-3xl w-full max-w-sm overflow-hidden animate-fade-in shadow-[0_0_50px_rgba(255,0,0,0.1)]">
        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <FiAlertTriangle size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">{title}</h3>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
            >
              No, cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Eliminando..." : <><FiTrash2 /> Sí, eliminar</>}
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};
