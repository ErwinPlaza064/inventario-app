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
          <div key={i} className="h-16 bg-gray-50 border border-gray-100 rounded-xl w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-3xl animate-fade-in">
        <FiPackage className="mx-auto text-4xl text-gray-200 mb-4" />
        <p className="text-gray-400 font-medium">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            {/* Encabezado Negro de alto contraste */}
            <tr className="bg-black">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">ID</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white font-black">Producto</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white font-black text-right">Precio</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white font-black text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 text-xs font-mono text-gray-400">#{product.id}</td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-black uppercase tracking-tight">
                    {product.nombre}
                  </span>
                </td>
                <td className="px-6 py-5 text-right font-mono text-black font-black">
                  ${product.precio.toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-black/5 rounded-lg transition-all"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(product)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
