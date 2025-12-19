import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/product";
import { ENDPOINTS } from "@/lib/config";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  isSubmitting: boolean;
  fetchProducts: () => Promise<void>;
  createProduct: (productData: Omit<Product, "id">) => Promise<boolean>;
  updateProduct: (productData: Product) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(ENDPOINTS.productos);
      
      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData: Omit<Product, "id">): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await fetch(ENDPOINTS.productos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Error al crear producto");
      }

      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error creating product:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProduct = async (productData: Product): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${ENDPOINTS.productos}/${productData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar producto");
      }

      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${ENDPOINTS.productos}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }

      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    isSubmitting,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
