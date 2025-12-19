"use client";

import { Product } from "@/types/product";
import { useProducts, useProductModal } from "@/hooks";
import StatsHeader from "@/components/StatsHeader";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModal";
import ConfirmModal from "@/components/ConfirmModal";

export default function Home() {
  const { products, loading, isSubmitting, createProduct, updateProduct, deleteProduct } = useProducts();
  const { 
    isProductModalOpen, 
    openProductModal, 
    closeProductModal,
    isConfirmModalOpen, 
    openConfirmModal, 
    closeConfirmModal,
    selectedProduct 
  } = useProductModal();

  const handleSave = async (productData: Omit<Product, "id"> | Product) => {
    let success: boolean;
    
    if ("id" in productData) {
      success = await updateProduct(productData as Product);
    } else {
      success = await createProduct(productData);
    }

    if (success) {
      closeProductModal();
    } else {
      alert("Error al guardar el producto");
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    const success = await deleteProduct(selectedProduct.id);
    
    if (success) {
      closeConfirmModal();
    } else {
      alert("Error al eliminar el producto");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 sm:p-8">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xMiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHpNMjQgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto">
        <StatsHeader productCount={products.length} />

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => openProductModal()}
            className="flex items-center gap-2 px-5 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        <div className="animate-slide-up">
          <ProductTable 
            products={products} 
            loading={loading}
            onEdit={openProductModal}
            onDelete={openConfirmModal}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs font-light">
            Sistema de inventario • CRUD completo
          </p>
        </div>
      </div>

      {/* Product Modal (Create/Edit) */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onSave={handleSave}
        product={selectedProduct}
        isLoading={isSubmitting}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de eliminar "${selectedProduct?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isSubmitting}
        variant="danger"
      />
    </div>
  );
}
