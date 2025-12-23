"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiUser, FiLock, FiArrowRight, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ENDPOINTS } from "../../lib/config";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
              Gestión inteligente de tareas IT
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-6 pt-12 lg:p-6 xl:p-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/login-art.png"
              alt="IT Controller"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">
              IT Controller
            </h2>
          </div>

          <div className="mb-6 lg:mb-6">
            <h1 className="text-3xl lg:text-3xl xl:text-4xl font-black text-black dark:text-white tracking-tight mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-400 dark:text-gray-500 font-medium text-sm lg:text-base">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Usuario
              </label>
              <div className="relative group">
                <FiUser
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    error && !username
                      ? "text-red-400"
                      : "text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isSubmitting}
                  className={`w-full bg-gray-50 dark:bg-gray-900 border-2 rounded-xl py-4 pl-12 pr-4 text-black dark:text-white font-medium outline-none transition-all ${
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
                <FiLock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    error && !password
                      ? "text-red-400"
                      : "text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white"
                  }`}
                />
                <input
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isSubmitting}
                  className={`w-full bg-gray-50 dark:bg-gray-900 border-2 rounded-xl py-4 pl-12 pr-4 text-black dark:text-white font-medium outline-none transition-all ${
                    error && !password
                      ? "border-red-500 placeholder:text-red-400 animate-shake"
                      : "border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:scale-100 mt-8"
            >
              {isSubmitting ? "ENTRANDO..." : "INICIAR SESIÓN"}
              {!isSubmitting && <FiArrowRight />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 font-medium">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-black dark:text-white font-bold hover:underline underline-offset-4"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
