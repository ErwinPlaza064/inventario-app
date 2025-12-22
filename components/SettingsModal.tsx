
import { useState } from "react";
import { FiX, FiSave, FiUser, FiLock } from "react-icons/fi";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { username, updateUser } = useAuth();
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
        setTimeout(onClose, 1500); // Close after success
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl relative animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Mi Perfil</h2>
            <p className="text-gray-400 text-sm font-bold">Personaliza tu cuenta</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-2">Nombre de Usuario</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-black font-bold outline-none focus:border-black transition-all"
                placeholder="Tu nombre..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-2">Nueva Contraseña (Opcional)</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-black font-bold outline-none focus:border-black transition-all"
                placeholder="********"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-bold text-center">
              ¡Perfil actualizado correctamente!
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiSave /> GUARDAR CAMBIOS
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
