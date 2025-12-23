export type CredentialCategory = "General" | "Redes" | "Servidores" | "Personal" | "Software" | "Impresora" | "Otro";

export interface Credencial {
  id: number;
  titulo: string;
  valor: string;
  usuario?: string;
  categoria?: CredentialCategory;
  fechaCreacion: string;
}

export const CREDENTIAL_CATEGORIES: Record<CredentialCategory, { label: string; iconName: string; color: string }> = {
  General: { label: "General", iconName: "FiLock", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
  Redes: { label: "Redes", iconName: "FiWifi", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  Servidores: { label: "Servidores", iconName: "FiServer", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  Personal: { label: "Personal", iconName: "FiUser", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
  Software: { label: "Software", iconName: "FiCode", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Impresora: { label: "Impresora", iconName: "FiPrinter", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  Otro: { label: "Otro", iconName: "FiGrid", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};
