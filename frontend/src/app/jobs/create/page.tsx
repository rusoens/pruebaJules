'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createJob as createJobService } from '@/services/jobService';

export default function CreateJobPage() {
  const router = useRouter();
  const { currentUser, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentUser) {
        setError("Debes estar logueado para crear un trabajo.");
        return;
    }

    setLoading(true);
    try {
      const response = await createJobService(formData);
      if (response.success && response.data) {
        router.push(`/jobs/${response.data._id}`);
      } else {
        setError(response.error || 'Error al crear el trabajo.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Cargando...</p>;
  if (!currentUser) return null;


  return (
    <div>
      <h2>Publicar un Nuevo Trabajo</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titleJobInput" className="form-label">Título del Trabajo</label>
          <input
            type="text"
            className="form-control"
            id="titleJobInput"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descriptionJobTextarea" className="form-label">Descripción Detallada</label>
          <textarea
            className="form-control"
            id="descriptionJobTextarea"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="locationJobInput" className="form-label">Ubicación (Ciudad/Zona)</label>
          <input
            type="text"
            className="form-control"
            id="locationJobInput"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar Trabajo'}
        </button>
      </form>
    </div>
  );
}
