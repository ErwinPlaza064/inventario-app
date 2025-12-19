// Configuración de la aplicación

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5021/api";

export const ENDPOINTS = {
  productos: `${API_URL}/productos`,
} as const;
