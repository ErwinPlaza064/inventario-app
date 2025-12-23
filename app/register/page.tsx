"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiUserPlus, FiUser, FiLock, FiArrowLeft, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { ENDPOINTS } from "../../lib/config";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

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
    <div className="min-h-screen bg-white dark:bg-black flex relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all z-20"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>

      {/* Left Panel - Illustration (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 dark:bg-gray-900 items-center justify-center p-6 xl:p-12 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-sm xl:max-w-xl">
          <Image
            src="/login-art.png"
            alt="IT Controller Illustration"
            width={800}
            height={800}
            className="w-full h-auto animate-float animate-glow"
            priority
          />
          <div className="text-center mt-4 xl:mt-8">
            <h2 className="text-xl xl:text-2xl font-black text-gray-800 dark:text-white tracking-tight">
              IT Controller
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 xl:mt-2 font-medium text-sm xl:text-base">
              Únete al equipo de gestión IT
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-4 pt-4 lg:p-6 xl:p-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white font-bold text-sm mb-3 transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Volver al Login
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-3">
            <Image
              src="/login-art.png"
              alt="IT Controller"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>

          <div className="mb-4 lg:mb-6">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black text-black dark:text-white tracking-tight mb-1">
              Crear Cuenta
            </h1>
            <p className="text-gray-400 dark:text-gray-500 font-medium text-sm lg:text-base">
              Únete al equipo de IT
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6 text-sm font-bold">
              ¡Usuario creado! Redirigiendo...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Usuario
              </label>
              <div className="relative group">
                <FiUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error && !username ? "text-red-400" : "text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white"}`} />
                <input
                  type="text"
                  placeholder="Elige un nombre de usuario"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isSubmitting || success}
                  className={`w-full bg-gray-50 dark:bg-gray-900 border-2 rounded-lg py-3 pl-12 pr-4 text-black dark:text-white font-medium outline-none transition-all ${
                    error && !username 
                      ? "border-red-500 placeholder:text-red-400 animate-shake" 
                      : "border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error && !password ? "text-red-400" : "text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white"}`} />
                <input
                  type="password"
                  placeholder="Crea una contraseña segura"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isSubmitting || success}
                  className={`w-full bg-gray-50 dark:bg-gray-900 border-2 rounded-lg py-3 pl-12 pr-4 text-black dark:text-white font-medium outline-none transition-all ${
                    error && !password 
                      ? "border-red-500 placeholder:text-red-400 animate-shake" 
                      : "border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-3.5 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:scale-100 mt-6"
            >
              {isSubmitting ? "REGISTRANDO..." : "CREAR CUENTA"}
              {!isSubmitting && <FiUserPlus />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 font-medium">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-black dark:text-white font-bold hover:underline underline-offset-4">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
