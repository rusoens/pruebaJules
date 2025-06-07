'use client';

import React, { useEffect, useState } from 'react';
import { getJobs, Job } from '@/services/jobService';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await getJobs();
        if (response.success && response.data) {
          setJobs(response.data);
        } else {
          setError(response.error || 'No se pudieron cargar los trabajos.');
        }
      } catch (err) {
        setError('Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p>Cargando trabajos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Trabajos Publicados</h1>
        {currentUser && (currentUser.role === 'client' || currentUser.data?.role === 'client') && (
          <Link href="/jobs/create" className="btn btn-success">Publicar Nuevo Trabajo</Link>
        )}
      </div>

      {jobs.length === 0 ? (
        <p>No hay trabajos publicados por el momento.</p>
      ) : (
        <div className="list-group">
          {jobs.map((job) => (
            <Link key={job._id} href={`/jobs/${job._id}`} className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{job.title}</h5>
                <small>{new Date(job.createdAt).toLocaleDateString()}</small>
              </div>
              <p className="mb-1">{job.description.substring(0,150)}{job.description.length > 150 ? '...' : ''}</p>
              <small>Ubicación: {job.location}. Publicado por: {job.client?.name || 'Desconocido'}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
