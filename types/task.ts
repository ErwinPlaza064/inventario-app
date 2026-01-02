export type TaskStatus = "Pendiente" | "EnProceso" | "Completada";

export type TaskCategory =
  | "Hardware"
  | "Software"
  | "Redes"
  | "Documentacion"
  | "Mantenimiento";

export type TaskPriority = "Baja" | "Media" | "Alta" | "Urgente";

export interface Tarea {
  id?: number;
  titulo: string;
  descripcion?: string;
  estado: TaskStatus;
  categoria?: TaskCategory;
  prioridad?: TaskPriority;
  fechaVencimiento?: string;
  fechaCreacion?: string;
}

// Configuración de prioridades con colores
export const PRIORITIES: Record<
  TaskPriority,
  { label: string; color: string; badgeColor: string }
> = {
  Baja: {
    label: "Baja",
    color: "text-gray-600 dark:text-gray-400",
    badgeColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  Media: {
    label: "Media",
    color: "text-blue-600 dark:text-blue-400",
    badgeColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  Alta: {
    label: "Alta",
    color: "text-orange-600 dark:text-orange-400",
    badgeColor:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  Urgente: {
    label: "Urgente",
    color: "text-red-600 dark:text-red-400",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

// Configuración de categorías con iconos y colores
// iconName se usa para renderizar el ícono de react-icons en el componente
export const CATEGORIES: Record<
  TaskCategory,
  { label: string; iconName: string; color: string }
> = {
  Hardware: {
    label: "Hardware",
    iconName: "FiMonitor",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  Software: {
    label: "Software",
    iconName: "FiCode",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  Redes: {
    label: "Redes",
    iconName: "FiWifi",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  Documentacion: {
    label: "Docs",
    iconName: "FiFileText",
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  Mantenimiento: {
    label: "Mant.",
    iconName: "FiTool",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
};

// Palabras clave para auto-detección de categorías
export const CATEGORY_KEYWORDS: Record<TaskCategory, string[]> = {
  Hardware: [
    "equipo",
    "computadora",
    "laptop",
    "ordenador",
    "impresora",
    "toner",
    "cartucho",
    "cable",
    "patch",
    "monitor",
    "teclado",
    "mouse",
    "hardware",
    "instalar ordenador",
    "revisar computadora",
    "entrega de equipo",
    "vigilancia",
  ],
  Software: [
    "vpn",
    "office",
    "365",
    "sap",
    "configurar",
    "instalacion",
    "instalar software",
    "escritorio",
    "software",
    "cuenta",
    "contraseña",
    "password",
    "configuracion",
  ],
  Redes: [
    "internet",
    "red",
    "router",
    "conexion",
    "wifi",
    "en red",
    "impresora en red",
    "falla de internet",
    "conectividad",
    "patch cord",
    "redes",
  ],
  Documentacion: [
    "excel",
    "documento",
    "reporte",
    "registrar",
    "entregar documento",
    "word",
    "pdf",
    "archivo",
    "documentacion",
  ],
  Mantenimiento: [
    "limpiar",
    "limpieza",
    "mantenimiento",
    "revision",
    "arreglar",
    "reparar",
    "cambiar cartucho",
    "toner",
  ],
};

// Función para auto-detectar categoría basada en el título
export function detectCategory(titulo: string): TaskCategory {
  const lowerTitle = titulo.toLowerCase();

  // Orden de prioridad para la detección
  const priorities: TaskCategory[] = [
    "Redes",
    "Software",
    "Documentacion",
    "Mantenimiento",
    "Hardware",
  ];

  for (const category of priorities) {
    const keywords = CATEGORY_KEYWORDS[category];
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  // Por defecto, Hardware
  return "Hardware";
}
