'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { login as loginService } from '@/services/authService';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { loginContext } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await loginService(formData);
      if (response.success && response.token && response.user) {
        loginContext(response);
        router.push('/'); // Redirigir al home
      } else {
        setError(response.error || 'Error en el inicio de sesión.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="emailInputLogin" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="emailInputLogin"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInputLogin" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="passwordInputLogin"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>
      <p className="mt-3">
        ¿No tienes una cuenta? <Link href="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}
