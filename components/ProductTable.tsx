import { Product } from "../types/product";
import { FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable = ({ products, isLoading, onEdit, onDelete }: ProductTableProps) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-card border border-border rounded-xl w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-card border border-border rounded-3xl animate-fade-in">
        <FiPackage className="mx-auto text-4xl text-gray-800 mb-4" />
        <p className="text-gray-500 font-medium">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border rounded-2xl overflow-hidden animate-fade-in">
      {/* Container con scroll horizontal para mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-border bg-black/50">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">ID</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Producto</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold text-right">Precio</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 text-sm font-mono text-gray-600">#{product.id}</td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-tight">
                    {product.nombre}
                  </span>
                </td>
                <td className="px-6 py-5 text-right font-mono text-white font-bold">
                  ${product.precio.toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(product)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
