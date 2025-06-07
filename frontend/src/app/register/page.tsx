'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Para App Router
import { useAuth } from '@/contexts/AuthContext';
import { register as registerService } from '@/services/authService';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { loginContext } = useAuth(); // Usar loginContext para actualizar estado global tras registro
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client', // 'client' o 'professional'
    mainSkill: '',
    description: '',
    whatsappNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const dataToSend = { ...formData };
      // @ts-ignore
      delete dataToSend.confirmPassword; // No enviar confirmPassword al backend

      const response = await registerService(dataToSend);
      if (response.success && response.token && response.user) {
        loginContext(response); // Actualizar AuthContext
        router.push('/'); // Redirigir al home o dashboard
      } else {
        setError(response.error || 'Error en el registro.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nameInput" className="form-label">Nombre Completo</label>
          <input
            type="text"
            className="form-control"
            id="nameInput"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPasswordInput" className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="confirmPasswordInput"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="roleSelect" className="form-label">Soy un:</label>
          <select
            className="form-select"
            id="roleSelect"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="client">Cliente (busco un profesional)</option>
            <option value="professional">Profesional (ofrezco mis servicios)</option>
          </select>
        </div>

        {formData.role === 'professional' && (
          <>
            <div className="mb-3">
              <label htmlFor="mainSkillInput" className="form-label">Oficio Principal</label>
              <input
                type="text"
                className="form-control"
                id="mainSkillInput"
                name="mainSkill"
                value={formData.mainSkill}
                onChange={handleChange}
                placeholder="Ej: Electricista, Plomero"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descriptionTextarea" className="form-label">Breve Descripción de tus servicios</label>
              <textarea
                className="form-control"
                id="descriptionTextarea"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="whatsappInput" className="form-label">Número de WhatsApp (con código de país)</label>
              <input
                type="tel"
                className="form-control"
                id="whatsappInput"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="Ej: +5491123456789"
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p className="mt-3">
        ¿Ya tienes una cuenta? <Link href="/login">Inicia Sesión aquí</Link>
      </p>
    </div>
  );
}
