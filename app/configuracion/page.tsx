"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiSave, FiUser, FiLock, FiMoon, FiSun, FiCheck, FiSettings, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import { apiFetch } from "../../lib/api";

export default function ConfiguracionPage() {
  const { openSidebar } = useSidebar();
  const { username, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile Form State
  const [newName, setNewName] = useState(username || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!newName.trim()) {
      setError("El nombre de usuario no puede estar vacío");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const body: any = { username: newName };
      if (password.trim()) {
        body.password = password;
      }

      const resp = await apiFetch("/auth/profile", {
        method: "POST",
        body: JSON.stringify(body)
      });

      if (resp.ok) {
        const data = await resp.json();
        updateUser(data.username);
        setSuccess(true);
        setPassword(""); // Clear password field
      } else {
        const errText = await resp.text();
        setError(errText || "Error al actualizar perfil");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto animate-fade-in relative z-10">
        
      {/* Header */}
      <header className="flex items-center gap-3 mb-8 lg:mb-12">
        <button 
          onClick={openSidebar}
          className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg active:scale-90 transition-transform lg:hidden"
        >
          <FiMenu size={20} />
        </button>
        
        <Link 
            href="/"
            className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-2 rounded-lg hover:scale-105 active:scale-95 transition-all mr-2"
            title="Volver al Inicio"
        >
            <FiArrowLeft size={20} />
        </Link>

        <h1 className="text-2xl lg:text-4xl font-black text-black dark:text-white tracking-tight uppercase flex items-center gap-3">
          <FiSettings className="text-gray-400" />
          CONFIGURACIÓN
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Profile Section */}
        <section className="space-y-6">
            <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <FiUser /> Perfil de Usuario
                </h2>
                <p className="text-gray-400 text-sm font-bold mt-1">Administra tu información personal</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 p-6 lg:p-8 rounded-lg border-2 border-gray-100 dark:border-gray-800 space-y-6">
                 <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-2">Nombre de Usuario</label>
                    <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/50 border-2 border-transparent focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white rounded-lg py-4 pl-12 pr-4 text-black dark:text-white font-bold outline-none transition-all"
                        placeholder="Tu nombre..."
                    />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-2">Nueva Contraseña (Opcional)</label>
                    <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/50 border-2 border-transparent focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white rounded-lg py-4 pl-12 pr-4 text-black dark:text-white font-bold outline-none transition-all"
                        placeholder="Dejar en blanco para no cambiar"
                    />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-lg text-sm font-bold text-center animate-shake border border-red-100 dark:border-red-900/30">
                    {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm font-bold text-center border border-green-100 dark:border-green-900/30 flex items-center justify-center gap-2">
                    <FiCheck /> ¡Perfil actualizado correctamente!
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 dark:shadow-none flex justify-center items-center gap-2 disabled:opacity-50 disabled:scale-100"
                >
                    {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                    ) : (
                    <>
                        <FiSave /> GUARDAR CAMBIOS
                    </>
                    )}
                </button>
            </div>
        </section>

        {/* Appearance Section */}
        <section className="space-y-6">
             <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <FiSun /> Apariencia
                </h2>
                <p className="text-gray-400 text-sm font-bold mt-1">Personaliza tu experiencia visual</p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 p-6 lg:p-8 rounded-lg border-2 border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4">
                 <button
                    onClick={() => theme === "dark" && toggleTheme()}
                    className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                        theme === "light" 
                        ? "border-black bg-gray-50 text-black shadow-xl" 
                        : "border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-300"
                    }`}
                 >
                    <div className="p-4 bg-white rounded-full shadow-sm">
                        <FiSun size={24} />
                    </div>
                    <span className="font-bold text-sm">MODO CLARO</span>
                 </button>

                 <button
                    onClick={() => theme === "light" && toggleTheme()}
                    className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                        theme === "dark" 
                        ? "border-white bg-gray-800 text-white shadow-xl shadow-black/20" 
                        : "border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                 >
                    <div className="p-4 bg-black rounded-full shadow-sm">
                        <FiMoon size={24} className="text-white" />
                    </div>
                    <span className="font-bold text-sm">MODO OSCURO</span>
                 </button>
            </div>
        </section>

      </div>
    </div>
  );
}
