"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";
import { FiX, FiCheck, FiPlus, FiEdit2 } from "react-icons/fi";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, "id"> | Product) => void;
  product?: Product | null;
  isSubmitting?: boolean;
}

export const ProductModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product,
  isSubmitting = false 
}: ProductModalProps) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [errors, setErrors] = useState<{ nombre?: string; precio?: string }>({});

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setNombre(product.nombre);
      setPrecio(product.precio.toString());
    } else {
      setNombre("");
      setPrecio("");
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = () => {
    const newErrors: { nombre?: string; precio?: string } = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!precio.trim()) {
      newErrors.precio = "El precio es requerido";
    } else if (isNaN(Number(precio)) || Number(precio) < 0) {
      newErrors.precio = "Ingresa un precio válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      ...(isEditing && { id: product.id }),
      nombre: nombre.trim(),
      precio: Number(precio),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-3xl w-full max-w-md overflow-hidden animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
            {isEditing ? <FiEdit2 /> : <FiPlus />}
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nombre del Producto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mac Studio"
              className="w-full bg-black border border-border text-white px-4 py-3 rounded-xl focus:border-white outline-none transition-all placeholder:text-gray-800"
            />
            {errors.nombre && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.nombre}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Precio (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black border border-border text-white pl-8 pr-4 py-3 rounded-xl focus:border-white outline-none transition-all placeholder:text-gray-800"
              />
            </div>
            {errors.precio && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.precio}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Guardando..." : <><FiCheck /> {isEditing ? "Actualizar" : "Crear"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
