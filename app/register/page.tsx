"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUserPlus, FiUser, FiLock, FiArrowLeft } from "react-icons/fi";
import { ENDPOINTS } from "../../lib/config";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${ENDPOINTS.auth}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Error al registrar usuario");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-10">
          <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-black font-bold text-sm mb-6 transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Volver al Login
          </Link>
          <h1 className="text-4xl font-black text-black tracking-tighter mb-2">CREAR CUENTA</h1>
          <p className="text-gray-400 font-medium">Únete a la IT Suite para colaborar.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-2xl mb-6 text-sm font-bold">
            ¡Usuario creado! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative group">
            <FiUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error && !username ? "text-red-400" : "text-gray-300 group-focus-within:text-black"}`} />
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting || success}
              className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 text-black font-bold outline-none transition-all ${
                error && !username 
                  ? "border-red-500 placeholder:text-red-400 animate-shake" 
                  : "border-gray-100 focus:bg-white focus:border-black"
              }`}
            />
          </div>

          <div className="relative group">
            <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error && !password ? "text-red-400" : "text-gray-300 group-focus-within:text-black"}`} />
            <input
              type="password"
              placeholder="Contraseña Segura"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting || success}
              className={`w-full bg-gray-50 border-2 rounded-2xl py-4 pl-12 pr-4 text-black font-bold outline-none transition-all ${
                error && !password 
                  ? "border-red-500 placeholder:text-red-400 animate-shake" 
                  : "border-gray-100 focus:bg-white focus:border-black"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 disabled:bg-gray-200"
          >
            {isSubmitting ? "REGISTRANDO..." : "REGISTRARMEHORA"}
            {!isSubmitting && <FiUserPlus />}
          </button>
        </form>
      </div>
    </div>
  );
}
