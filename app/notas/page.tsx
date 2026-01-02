"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FiPlus,
  FiFileText,
  FiTrash2,
  FiClock,
  FiMenu,
  FiEdit,
  FiSave,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { apiFetch } from "../../lib/api";
import { ENDPOINTS } from "../../lib/config";
import { useSidebar } from "../../context/SidebarContext";
import MarkdownRenderer from "../../components/MarkdownRenderer";

// Enums mapped from backend
enum NotaPrioridad {
  Baja = 0,
  Media = 1,
  Alta = 2,
}

enum TaskCategory {
  Hardware = 0,
  Software = 1,
  Redes = 2,
  Documentacion = 3,
  Mantenimiento = 4,
}

interface Nota {
  id: number;
  titulo: string;
  contenido: string;
  prioridad: NotaPrioridad;
  categoria: TaskCategory;
  fechaCreacion: string;
}

export default function NotasPage() {
  const { openSidebar } = useSidebar();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNota, setSelectedNota] = useState<Nota | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [nuevaNota, setNuevaNota] = useState({
    titulo: "",
    contenido: "",
    prioridad: NotaPrioridad.Media,
    categoria: TaskCategory.Documentacion,
  });

  const fetchNotas = useCallback(async () => {
    try {
      const resp = await apiFetch(ENDPOINTS.notas);
      if (resp.ok) {
        const data = await resp.json();
        setNotas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const [error, setError] = useState(false);

  // ... (existing code)

  const guardarNota = async () => {
    if (!nuevaNota.titulo.trim() || !nuevaNota.contenido.trim()) {
      setError(true);
      return;
    }
    setError(false);

    // ... (existing code)
    try {
      const resp = await apiFetch(ENDPOINTS.notas, {
        method: "POST",
        body: JSON.stringify(nuevaNota),
      });
      if (resp.ok) {
        setNuevaNota({
          titulo: "",
          contenido: "",
          prioridad: NotaPrioridad.Media,
          categoria: TaskCategory.Documentacion,
        });
        setShowModal(false);
        fetchNotas();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarNota = async (id: number) => {
    try {
      const resp = await apiFetch(`${ENDPOINTS.notas}/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) fetchNotas();
    } catch (err) {
      console.error(err);
    }
  };

  const actualizarNota = async () => {
    if (!selectedNota) return;
    try {
      const resp = await apiFetch(`${ENDPOINTS.notas}/${selectedNota.id}`, {
        method: "PUT",
        body: JSON.stringify(selectedNota),
      });
      if (resp.ok) {
        setIsEditing(false);
        fetchNotas();
      }
    } catch (err) {
      console.error(err);
    }
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
            NOTAS IT
          </h1>
        </div>

        <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end gap-4">
          <div className="relative w-full lg:w-96 group z-10">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 font-bold outline-none focus:border-black dark:focus:border-white transition-all shadow-sm focus:shadow-xl"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-none shadow-gray-200 whitespace-nowrap"
          >
            <FiPlus /> NUEVA
          </button>
        </div>
      </header>

      {notas.filter(
        (n) =>
          n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.contenido.toLowerCase().includes(searchTerm.toLowerCase())
      ).length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[40px]">
          <FiClock className="mx-auto text-4xl text-gray-200 dark:text-gray-700 mb-4" />
          <p className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-widest">
            {searchTerm
              ? "No se encontraron resultados"
              : "No hay notas guardadas"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notas
            .filter(
              (n) =>
                n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.contenido.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((nota) => (
              <div
                key={nota.id}
                onClick={() => setSelectedNota(nota)}
                className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 p-8 rounded-[32px] hover:border-black dark:hover:border-white transition-all group flex flex-col h-80 cursor-pointer shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-gray-100 dark:hover:shadow-none relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-4 rounded-2xl text-white transition-all transform group-hover:rotate-6 ${
                      nota.prioridad === NotaPrioridad.Alta
                        ? "bg-red-500 shadow-red-200"
                        : nota.prioridad === NotaPrioridad.Media
                        ? "bg-yellow-500 shadow-yellow-200"
                        : "bg-blue-500 shadow-blue-200"
                    } shadow-lg`}
                  >
                    <FiFileText size={24} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        nota.prioridad === NotaPrioridad.Alta
                          ? "bg-red-100 text-red-600"
                          : nota.prioridad === NotaPrioridad.Media
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {NotaPrioridad[nota.prioridad]}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarNota(nota.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 dark:text-gray-600 hover:text-red-500 transition-all"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white uppercase mb-3 tracking-tight leading-tight">
                  {nota.titulo}
                </h3>

                {/* Extracto del contenido */}
                <div className="flex-1 overflow-hidden mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {nota.contenido.substring(0, 120)}
                    {nota.contenido.length > 120 ? "..." : ""}
                  </p>
                </div>

                {/* Fecha de creación */}
                <div className="mb-4 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <FiClock size={14} />
                  <span className="font-semibold">
                    {new Date(nota.fechaCreacion).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-[10px] font-black text-gray-200 dark:text-gray-600 uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {TaskCategory[nota.categoria]}
                  </span>
                  <span className="text-gray-300 dark:text-gray-500">
                    {nota.contenido.length} caracteres
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal Nueva Nota */}
      {showModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-start sm:items-center justify-center pt-20 sm:pt-0 p-4 sm:p-6 animate-fade-in overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-lg p-6 sm:p-10 shadow-2xl dark:shadow-none relative animate-scale-up">
              <h2 className="text-3xl font-black text-black dark:text-white mb-8 uppercase tracking-tighter">
                Nueva Nota IT
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={
                    error && !nuevaNota.titulo
                      ? "¡El título es obligatorio!"
                      : "Título (ej: Config Servidor)"
                  }
                  value={nuevaNota.titulo}
                  onChange={(e) => {
                    setNuevaNota({ ...nuevaNota, titulo: e.target.value });
                    if (error) setError(false);
                  }}
                  className={`w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl py-4 px-6 text-black dark:text-white font-bold outline-none transition-all ${
                    error && !nuevaNota.titulo
                      ? "border-red-500 placeholder:text-red-400 animate-shake"
                      : "border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-black dark:focus:border-white"
                  }`}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Prioridad
                    </label>
                    <select
                      value={nuevaNota.prioridad}
                      onChange={(e) =>
                        setNuevaNota({
                          ...nuevaNota,
                          prioridad: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl p-3 font-bold outline-none focus:border-black dark:focus:border-white transition-all text-sm"
                    >
                      <option value={NotaPrioridad.Baja}>BAJA</option>
                      <option value={NotaPrioridad.Media}>MEDIA</option>
                      <option value={NotaPrioridad.Alta}>ALTA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Categoría
                    </label>
                    <select
                      value={nuevaNota.categoria}
                      onChange={(e) =>
                        setNuevaNota({
                          ...nuevaNota,
                          categoria: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl p-3 font-bold outline-none focus:border-black dark:focus:border-white transition-all text-sm"
                    >
                      <option value={TaskCategory.Hardware}>HARDWARE</option>
                      <option value={TaskCategory.Software}>SOFTWARE</option>
                      <option value={TaskCategory.Redes}>REDES</option>
                      <option value={TaskCategory.Documentacion}>
                        DOCUMENTACIÓN
                      </option>
                      <option value={TaskCategory.Mantenimiento}>
                        MANTENIMIENTO
                      </option>
                    </select>
                  </div>
                </div>

                <textarea
                  placeholder={
                    error && !nuevaNota.contenido
                      ? "¡La nota no puede estar vacía!"
                      : "Contenido de la nota (Soporta Markdown)..."
                  }
                  value={nuevaNota.contenido}
                  rows={5}
                  onChange={(e) => {
                    setNuevaNota({ ...nuevaNota, contenido: e.target.value });
                    if (error) setError(false);
                  }}
                  className={`w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl py-4 px-6 text-black dark:text-white font-bold outline-none resize-none transition-all ${
                    error && !nuevaNota.contenido
                      ? "border-red-500 placeholder:text-red-400 animate-shake"
                      : "border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-black dark:focus:border-white"
                  }`}
                />
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 text-gray-400 dark:text-gray-500 font-bold hover:text-black dark:hover:text-white transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={guardarNota}
                    className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-none shadow-gray-200"
                  >
                    GUARDAR NOTA
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      {/* Modal Detalle Nota */}
      {selectedNota &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[90vh] rounded-[24px] md:rounded-[32px] p-6 md:p-12 shadow-2xl dark:shadow-none relative animate-scale-up flex flex-col">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNota(null);
                  setIsEditing(false);
                }}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              >
                <FiX className="text-2xl text-gray-400" />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 md:mb-8">
                <div
                  className={`p-4 rounded-2xl text-white shadow-lg ${
                    selectedNota.prioridad === NotaPrioridad.Alta
                      ? "bg-red-500 shadow-red-200"
                      : selectedNota.prioridad === NotaPrioridad.Media
                      ? "bg-yellow-500 shadow-yellow-200"
                      : "bg-blue-500 shadow-blue-200"
                  }`}
                >
                  <FiFileText size={24} />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={selectedNota.titulo}
                      onChange={(e) =>
                        setSelectedNota({
                          ...selectedNota,
                          titulo: e.target.value,
                        })
                      }
                      className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-2 bg-transparent border-b-2 border-gray-200 dark:border-gray-700 outline-none w-full"
                    />
                  ) : (
                    <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-2 pr-8">
                      {selectedNota.titulo}
                    </h2>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                    <span>
                      {new Date(
                        selectedNota.fechaCreacion
                      ).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>

                    {isEditing ? (
                      <>
                        <select
                          value={selectedNota.categoria}
                          onChange={(e) =>
                            setSelectedNota({
                              ...selectedNota,
                              categoria: Number(e.target.value),
                            })
                          }
                          className="bg-gray-100 dark:bg-gray-800 rounded p-1 text-xs font-bold"
                        >
                          <option value={TaskCategory.Hardware}>
                            HARDWARE
                          </option>
                          <option value={TaskCategory.Software}>
                            SOFTWARE
                          </option>
                          <option value={TaskCategory.Redes}>REDES</option>
                          <option value={TaskCategory.Documentacion}>
                            DOCUMENTACIÓN
                          </option>
                          <option value={TaskCategory.Mantenimiento}>
                            MANTENIMIENTO
                          </option>
                        </select>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <select
                          value={selectedNota.prioridad}
                          onChange={(e) =>
                            setSelectedNota({
                              ...selectedNota,
                              prioridad: Number(e.target.value),
                            })
                          }
                          className="bg-gray-100 dark:bg-gray-800 rounded p-1 text-xs font-bold"
                        >
                          <option value={NotaPrioridad.Baja}>BAJA</option>
                          <option value={NotaPrioridad.Media}>MEDIA</option>
                          <option value={NotaPrioridad.Alta}>ALTA</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <span>{TaskCategory[selectedNota.categoria]}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span
                          className={`${
                            selectedNota.prioridad === NotaPrioridad.Alta
                              ? "text-red-500"
                              : selectedNota.prioridad === NotaPrioridad.Media
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }`}
                        >
                          {NotaPrioridad[selectedNota.prioridad]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto pr-4 custom-scrollbar -mr-4 flex-1">
                {isEditing ? (
                  <textarea
                    value={selectedNota.contenido}
                    onChange={(e) =>
                      setSelectedNota({
                        ...selectedNota,
                        contenido: e.target.value,
                      })
                    }
                    className="w-full h-full min-h-[300px] bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 font-bold text-gray-600 dark:text-gray-300 outline-none resize-none"
                    placeholder="Contenido (Soporta Markdown)..."
                  />
                ) : (
                  <MarkdownRenderer content={selectedNota.contenido} />
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
                {isEditing ? (
                  <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex justify-center items-center gap-2 text-gray-400 font-bold hover:text-black dark:hover:text-white px-4 py-2 text-sm transition-all"
                    >
                      CANCELAR
                    </button>
                    <button
                      onClick={actualizarNota}
                      className="bg-black dark:bg-white text-white dark:text-black font-black px-4 py-2 text-sm rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-none shadow-gray-200 flex justify-center items-center gap-2"
                    >
                      <FiSave /> GUARDAR
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        const confirm = window.confirm(
                          "¿Estás seguro de eliminar esta nota?"
                        );
                        if (confirm) {
                          eliminarNota(selectedNota.id);
                          setSelectedNota(null);
                        }
                      }}
                      className="flex justify-center items-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 text-sm rounded-xl transition-all"
                    >
                      <FiTrash2 /> ELIMINAR
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-black dark:bg-white text-white dark:text-black font-black px-4 py-2 text-sm rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-none shadow-gray-200 flex justify-center items-center gap-2"
                    >
                      <FiEdit /> EDITAR
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
