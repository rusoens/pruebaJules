'use client'; // Necesario para Context en App Router si se usa en Client Components

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logout as authLogout, AuthResponse, UserProfile } from '@/services/authService'; // Ajustar path si es necesario

interface AuthContextType {
  currentUser: UserProfile | null; // Tipo del usuario almacenado
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginContext: (userData: AuthResponse) => void;
  logoutContext: () => void;
  reloadUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario y token desde localStorage al iniciar
    const storedToken = localStorage.getItem('token');
    const storedUser = getCurrentUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const loginContext = (authData: AuthResponse) => {
    if (authData.success && authData.token && authData.user) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      setToken(authData.token);
      setCurrentUser(authData.user as UserProfile); // castear si es necesario
    } else {
      // Manejar error de login si es necesario aquí o en el componente
      console.error("Error en loginContext:", authData.error);
    }
  };

  const logoutContext = () => {
    authLogout(); // Limpia localStorage
    setCurrentUser(null);
    setToken(null);
    // Opcional: redirigir al home o login page
    // window.location.href = '/login';
  };

  const reloadUser = () => { // Para recargar el usuario si cambia en el backend
    const storedUser = getCurrentUser();
    if(storedUser) setCurrentUser(storedUser);
  }

  return (
    <AuthContext.Provider value={{ currentUser, token, isAuthenticated: !!currentUser, isLoading, loginContext, logoutContext, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
