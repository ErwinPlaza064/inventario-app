"use client";

import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";

import { useRouter } from "next/navigation";

function RootContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    // Si no está cargando y no está autenticado, y no estamos en login/register -> ir a login
    if (!loading && !isAuthenticated && !isAuthPage) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isAuthPage, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Botón Hamburguesa para Móvil */}
      {!isAuthPage && isAuthenticated && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-6 left-6 z-30 bg-black text-white p-3 rounded-2xl shadow-xl shadow-black/10 active:scale-90 transition-transform"
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Sidebar solo si está logeado y no es página de auth */}
      {!isAuthPage && isAuthenticated && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
      
      <main className={`flex-1 transition-all duration-300 ${!isAuthPage && isAuthenticated ? 'lg:ml-64' : 'ml-0'}`}>
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <title>IT SUITE - Management Pro</title>
      </head>
      <body className="antialiased bg-white">
        <AuthProvider>
          <RootContent>
            {children}
          </RootContent>
        </AuthProvider>
      </body>
    </html>
  );
}
