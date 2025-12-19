import { useState, useCallback } from "react";
import { Product } from "@/types/product";

interface UseProductModalReturn {
  // Product Modal (Create/Edit)
  isProductModalOpen: boolean;
  openProductModal: (product?: Product | null) => void;
  closeProductModal: () => void;
  
  // Confirm Modal (Delete)
  isConfirmModalOpen: boolean;
  openConfirmModal: (product: Product) => void;
  closeConfirmModal: () => void;
  
  // Selected product for both modals
  selectedProduct: Product | null;
}

export function useProductModal(): UseProductModalReturn {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Product Modal handlers
  const openProductModal = useCallback((product?: Product | null) => {
    setSelectedProduct(product || null);
    setIsProductModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Confirm Modal handlers
  const openConfirmModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsConfirmModalOpen(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setSelectedProduct(null);
  }, []);

  return {
    isProductModalOpen,
    openProductModal,
    closeProductModal,
    isConfirmModalOpen,
    openConfirmModal,
    closeConfirmModal,
    selectedProduct,
  };
}
