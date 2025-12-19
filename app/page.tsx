"use client";

import { StatsHeader } from "../components/StatsHeader";
import { ProductTable } from "../components/ProductTable";
import { ProductModal } from "../components/ProductModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { useProducts, useProductModal } from "../hooks";
import { FiPlus } from "react-icons/fi";

export default function Home() {
  const { 
    products, 
    loading, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    isSubmitting 
  } = useProducts();

  const {
    isProductModalOpen,
    isConfirmModalOpen,
    selectedProduct,
    openProductModal,
    closeProductModal,
    openConfirmModal,
    closeConfirmModal,
  } = useProductModal();

  const onFormSubmit = async (data: any) => {
    const success = selectedProduct 
      ? await updateProduct(data)
      : await createProduct(data);
    
    if (success) closeProductModal();
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto py-12 md:py-24 px-4 sm:px-6">
        
        {/* Header Section */}
        <StatsHeader totalProducts={products.length} />

        {/* Action Button */}
        <div className="mb-8 flex justify-between items-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-700">
              Inventario Activo
            </h2>
          </div>
          <button
            onClick={() => openProductModal(null)}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <FiPlus size={16} />
            Nuevo
          </button>
        </div>

        {/* Data Section */}
        <div style={{ animationDelay: '0.2s' }} className="animate-fade-in">
          <ProductTable
            products={products}
            isLoading={loading}
            onEdit={openProductModal}
            onDelete={openConfirmModal}
          />
        </div>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700">
          <p>© 2025 SISTEMA DE GESTIÓN PRO</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-400 cursor-help">PRIVACIDAD</span>
            <span className="hover:text-gray-400 cursor-help">TÉRMINOS</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onSubmit={onFormSubmit}
        product={selectedProduct}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={async () => {
          if (selectedProduct) {
            const success = await deleteProduct(selectedProduct.id);
            if (success) closeConfirmModal();
          }
        }}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${selectedProduct?.nombre}"? Esta acción no se puede deshacer.`}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
