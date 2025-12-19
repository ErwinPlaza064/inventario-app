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
      {/* Overlay suave */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Blanco */}
      <div className="relative bg-white border border-gray-200 rounded-3xl w-full max-w-md overflow-hidden animate-fade-in shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
            {isEditing ? <FiEdit2 /> : <FiPlus />}
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre del Producto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mac Studio"
              className="w-full bg-white border border-gray-200 text-black px-4 py-3 rounded-xl focus:border-black outline-none transition-all placeholder:text-gray-300"
            />
            {errors.nombre && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.nombre}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Precio (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border border-gray-200 text-black pl-8 pr-4 py-3 rounded-xl focus:border-black outline-none transition-all placeholder:text-gray-300"
              />
            </div>
            {errors.precio && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.precio}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "GUARDANDO..." : <><FiCheck /> {isEditing ? "ACTUALIZAR" : "CREAR"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
