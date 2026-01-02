"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBox,
  FiCheckSquare,
  FiFileText,
  FiLogOut,
  FiSettings,
  FiLock,
  FiSun,
  FiMoon,
  FiActivity,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const menuItems = [
  { name: "Novedades", icon: FiActivity, path: "/novedades" },
  { name: "Tareas IT", icon: FiCheckSquare, path: "/tareas" },
  { name: "Notas Rápidas", icon: FiFileText, path: "/notas" },
  { name: "Bóveda de Accesos", icon: FiLock, path: "/boveda" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { logout, username } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-dvh w-64 bg-black dark:bg-[#0a0a0a] border-r border-white/10 dark:border-white/5 flex flex-col z-40 transition-all duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* All content in a flex column that takes minimum full height */}
        <div className="flex flex-col min-h-full">
          {/* Header */}
          <div className="p-4 pb-4 shrink-0">
            <div className="mb-4 flex justify-between items-center gap-2">
              <h1 className="text-lg font-black tracking-tighter text-white whitespace-nowrap">
                IT CONTROLLER
              </h1>
              <div className="flex items-center gap-1">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                  title={theme === "light" ? "Modo Oscuro" : "Modo Claro"}
                >
                  {theme === "light" ? (
                    <FiMoon size={18} />
                  ) : (
                    <FiSun size={18} />
                  )}
                </button>
                {/* Botón cerrar */}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <FiLogOut className="rotate-180" size={18} />
                </button>
              </div>
            </div>

            {username && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/5 mx-2 flex justify-between items-center group">
                <div className="overflow-hidden flex-1 min-w-0">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                    Agente
                  </p>
                  <p className="text-sm text-white font-black truncate">
                    {username}
                  </p>
                </div>
                <Link
                  href="/configuracion"
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all shrink-0"
                  title="Configuración"
                >
                  <FiSettings size={18} />
                </Link>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-2 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? "bg-white text-black shadow-xl shadow-white/5"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer - Logout button - always at the end */}
          <div className="shrink-0 p-6 pt-4 pb-8 border-t border-white/10 mt-auto">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-sm font-bold transition-all"
            >
              <FiLogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
