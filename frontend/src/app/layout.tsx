'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/common/Navbar'; // Importar el nuevo Navbar

// export const metadata: Metadata = { ... } // Metadata se maneja en page.tsx o config para client components

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar /> {/* Usar el componente Navbar aquí */}
          <main className="container mt-4">
            {children}
          </main>
          <footer className="text-center mt-auto py-3 bg-light"> {/* Footer mejorado */}
            <div className="container">
                <p className="mb-0">&copy; {new Date().getFullYear()} Bolsa de Trabajo de Oficios. Todos los derechos reservados.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
