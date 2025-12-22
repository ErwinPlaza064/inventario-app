"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBox, FiCheckSquare, FiFileText, FiLogOut, FiSettings, FiLock } from "react-icons/fi";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";

import { useAuth } from "../context/AuthContext";

const menuItems = [
  { name: "Tareas IT", icon: FiCheckSquare, path: "/" },
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
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-black border-r border-white/10 flex flex-col p-6 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="mb-12 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              IT SUITE<span className="text-gray-500">.</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Management Pro</p>
          </div>
          {/* Botón cerrar para móvil */}
          <button onClick={onClose} className="lg:hidden text-white p-2">
            <FiLogOut className="rotate-180" size={20} />
          </button>
        </div>

        {username && (
          <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 mx-2 flex justify-between items-center group">
            <div className="overflow-hidden">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Agente</p>
              <p className="text-sm text-white font-black truncate">{username}</p>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              title="Configurar Perfil"
            >
              <FiSettings size={18} />
            </button>
          </div>
        )}

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
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

        <div className="pt-6 border-t border-white/10 space-y-2">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-4 w-full text-red-500 hover:bg-red-500/10 rounded-2xl text-sm font-bold transition-all"
          >
            <FiLogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};
