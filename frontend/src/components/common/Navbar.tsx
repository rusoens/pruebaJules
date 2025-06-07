'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { currentUser, logoutContext, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logoutContext();
    router.push('/login');
  };

  if (isLoading) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link href="/" className="navbar-brand">BolsaTrabajo</Link>
                <span className="navbar-text">Cargando...</span>
            </div>
        </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">BolsaTrabajo</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/jobs" className="nav-link">Trabajos</Link>
            </li>
            <li className="nav-item">
              <Link href="/professionals" className="nav-link">Profesionales</Link>
            </li>
            {currentUser && (currentUser.role === 'client' || currentUser.data?.role === 'client') && (
              <li className="nav-item">
                <Link href="/jobs/create" className="nav-link">Publicar Trabajo</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link href="/profile/edit" className="nav-link">Hola, {currentUser.name || currentUser.data?.name}</Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-link nav-link">Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">Registrarse</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
