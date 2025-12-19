// Configuración de la aplicación

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5021/api";

export const ENDPOINTS = {
  auth: `${API_URL}/auth`,
  tareas: `${API_URL}/tareas`,
  notas: `${API_URL}/notas`,
} as const;
