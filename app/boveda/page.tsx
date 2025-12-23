"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiPlus, FiLock, FiClock, FiKey, FiUser, FiMenu, FiSearch, FiEdit3, FiEye, FiEyeOff, FiRefreshCw, FiTag, FiServer, FiWifi, FiCode, FiGrid, FiPrinter } from "react-icons/fi";
import { apiFetch } from "../../lib/api";
import { CredencialCard } from "../../components/CredencialCard";
import { useSidebar } from "../../context/SidebarContext";
import { Credencial, CredentialCategory, CREDENTIAL_CATEGORIES } from "../../types/credential";

export default function BovedaPage() {
  const { openSidebar } = useSidebar();
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    valor: "",
    usuario: "",
    categoria: "General" as CredentialCategory
  });
  
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [error, setError] = useState(false);

  const fetchCredenciales = useCallback(async () => {
    try {
      const resp = await apiFetch("/credenciales");
      if (resp.ok) {
        const data = await resp.json();
        setCredenciales(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredenciales();
  }, [fetchCredenciales]);

  const resetForm = () => {
    setForm({ titulo: "", valor: "", usuario: "", categoria: "General" });
    setEditingId(null);
    setShowModalPassword(false);
    setError(false);
  };

  const handleEdit = (cred: Credencial) => {
    setForm({
      titulo: cred.titulo,
      valor: cred.valor,
      usuario: cred.usuario || "",
      categoria: cred.categoria || "General"
    });
    setEditingId(cred.id);
    setShowModal(true);
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setForm(prev => ({ ...prev, valor: retVal }));
    setShowModalPassword(true); // Show generated password
  };

  const guardarCredencial = async () => {
    if (!form.titulo.trim() || !form.valor.trim()) {
      setError(true);
      return;
    }
    setError(false);

    try {
      if (editingId) {
        // Update
        const resp = await apiFetch(`/credenciales/${editingId}`, {
            method: "PUT",
            body: JSON.stringify({ ...form, id: editingId }),
        });
        if (resp.ok) {
            fetchCredenciales();
            setShowModal(false);
            resetForm();
        }
      } else {
        // Create
        const resp = await apiFetch("/credenciales", {
            method: "POST",
            body: JSON.stringify(form),
        });
        if (resp.ok) {
            fetchCredenciales();
            setShowModal(false);
            resetForm();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarCredencial = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta credencial?")) return;
    try {
      const resp = await apiFetch(`/credenciales/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) fetchCredenciales();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCredenciales = credenciales.filter(cred => 
    cred.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (cred.usuario && cred.usuario.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cred.categoria && cred.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const iconMap: Record<string, React.ReactNode> = {
    FiLock: <FiLock />,
    FiWifi: <FiWifi />,
    FiServer: <FiServer />,
    FiUser: <FiUser />,
    FiCode: <FiCode />,
    FiGrid: <FiGrid />,
    FiPrinter: <FiPrinter />,
  };

  if (loading) return null;

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 lg:mb-12 gap-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={openSidebar}
            className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg active:scale-90 transition-transform"
          >
            <FiMenu size={20} />
          </button>
          <h1 className="text-2xl lg:text-4xl font-black text-black dark:text-white tracking-tight uppercase">
            BÓVEDA
          </h1>
        </div>

        <div className="flex-1 w-full lg:w-auto flex flex-col sm:flex-row justify-end gap-4">
             {/* Search Bar */}
            <div className="relative w-full lg:w-96 group z-10">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar claves..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 font-bold outline-none focus:border-black dark:focus:border-white transition-all shadow-sm focus:shadow-xl"
                />
            </div>

            <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="w-full lg:w-auto bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-none shadow-gray-200 whitespace-nowrap"
            >
            <FiPlus /> NUEVA CLAVE
            </button>
        </div>
      </header>

      {filteredCredenciales.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[40px]">
          <FiLock className="mx-auto text-4xl text-gray-200 dark:text-gray-700 mb-4" />
          <p className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-widest">
            {searchTerm ? "No se encontraron coincidencias" : "Tu bóveda está vacía"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCredenciales.map((cred) => (
            <CredencialCard
              key={cred.id}
              {...cred}
              onDelete={eliminarCredencial}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Modal Nueva/Editar Credencial */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl p-6 sm:p-10 shadow-2xl dark:shadow-none relative animate-scale-up border dark:border-gray-800 max-h-[95vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-black text-black dark:text-white mb-8 uppercase tracking-tighter">
              {editingId ? "Editar Secreto" : "Guardar Secreto"}
            </h2>
            <div className="space-y-6">
              {/* Titulo */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">
                  Título / Referencia
                </label>
                <div className="relative group">
                  <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    placeholder="Ej: Router Principal"
                    value={form.titulo}
                    onChange={(e) => {
                      setForm({ ...form, titulo: e.target.value });
                      if (error) setError(false);
                    }}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-xl py-4 pl-12 pr-6 text-black dark:text-white font-bold outline-none transition-all ${
                      error && !form.titulo
                        ? "border-red-500 placeholder:text-red-400 animate-shake"
                        : "border-transparent focus:bg-white dark:focus:bg-gray-950 focus:border-black dark:focus:border-white"
                    }`}
                  />
                </div>
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">
                   Categoría
                </label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                      {iconMap[CREDENTIAL_CATEGORIES[form.categoria].iconName]}
                   </div>
                   <select 
                      value={form.categoria}
                      onChange={(e) => setForm({...form, categoria: e.target.value as CredentialCategory})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl py-4 pl-12 pr-10 text-black dark:text-white font-bold outline-none appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:border-black dark:focus:border-white transition-all"
                   >
                      {Object.entries(CREDENTIAL_CATEGORIES).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                      ))}
                   </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <span className="text-xs">▼</span>
                   </div>
                </div>
              </div>

              {/* Usuario (Opcional) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">
                  Usuario (Opcional)
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    placeholder="Ej: admin"
                    value={form.usuario}
                    onChange={(e) =>
                      setForm({ ...form, usuario: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl py-4 pl-12 pr-6 text-black dark:text-white font-bold outline-none focus:bg-white dark:focus:bg-gray-950 focus:border-black dark:focus:border-white transition-all"
                  />
                </div>
              </div>

              {/* Valor / Contraseña */}
              <div className="space-y-2">
                 <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">
                       Contraseña / Valor
                    </label>
                    <button 
                       onClick={generatePassword}
                       className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                    >
                       <FiRefreshCw size={10} /> Generar Segura
                    </button>
                 </div>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  <input
                    type={showModalPassword ? "text" : "password"}
                    placeholder="******"
                    value={form.valor}
                    onChange={(e) => {
                      setForm({ ...form, valor: e.target.value });
                      if (error) setError(false);
                    }}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-xl py-4 pl-12 pr-12 text-black dark:text-white font-bold outline-none transition-all font-mono ${
                      error && !form.valor
                        ? "border-red-500 placeholder:text-red-400 animate-shake"
                        : "border-transparent focus:bg-white dark:focus:bg-gray-950 focus:border-black dark:focus:border-white"
                    }`}
                  />
                  <button
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                     {showModalPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-sm text-gray-400 dark:text-gray-500 font-bold hover:text-black dark:hover:text-white transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                >
                  CANCELAR
                </button>
                <button
                  onClick={guardarCredencial}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black py-3 text-sm rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-none shadow-gray-200"
                >
                  {editingId ? "ACTUALIZAR" : "GUARDAR"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
