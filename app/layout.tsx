"use client";

import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

function RootContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { isOpen, closeSidebar } = useSidebar();
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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="w-12 h-12 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* Sidebar solo si está logeado y no es página de auth */}
      {!isAuthPage && isAuthenticated && (
        <Sidebar isOpen={isOpen} onClose={closeSidebar} />
      )}
      
      <main className="flex-1 transition-all duration-300">
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
        <title>IT Controller</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="antialiased bg-white dark:bg-black">
        <ThemeProvider>
          <AuthProvider>
            <SidebarProvider>
              <RootContent>
                {children}
              </RootContent>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
