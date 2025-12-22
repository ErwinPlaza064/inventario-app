"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { ENDPOINTS } from "../../lib/config";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${ENDPOINTS.auth}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Error de autenticación");
      }

      const data = await response.json();
      login(data.token, data.username);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter mb-2 uppercase">IT SUITE</h1>
          <p className="text-gray-400 dark:text-gray-500 font-medium tracking-tight">Ingresa tus credenciales de TI</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <FiUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error && !username ? "text-red-400" : "text-gray-300 group-focus-within:text-black"}`} />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting}
              className={`w-full bg-gray-50 dark:bg-gray-900 border-2 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white font-bold outline-none transition-all ${
                error && !username 
                  ? "border-red-500 placeholder:text-red-400 animate-shake" 
                  : "border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white"
              }`}
            />
          </div>

          <div className="relative group">
            <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error && !password ? "text-red-400" : "text-gray-300 group-focus-within:text-black"}`} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting}
              className={`w-full bg-gray-50 dark:bg-gray-900 border-2 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white font-bold outline-none transition-all ${
                error && !password 
                  ? "border-red-500 placeholder:text-red-400 animate-shake" 
                  : "border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 dark:shadow-gray-800 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:scale-100"
          >
            {isSubmitting ? "ENTRANDO..." : "INICIAR SESIÓN"}
            {!isSubmitting && <FiArrowRight />}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-400 dark:text-gray-500 font-bold">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-black dark:text-white hover:underline underline-offset-4">
            REGÍSTRATE AQUÍ
          </Link>
        </p>
      </div>
    </div>
  );
}
