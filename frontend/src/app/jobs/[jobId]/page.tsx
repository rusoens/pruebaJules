'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getJobById, Job } from '@/services/jobService';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        setLoading(true);
        try {
          const response = await getJobById(jobId);
          if (response.success && response.data) {
            setJob(response.data);
          } else {
            setError(response.error || 'No se pudo cargar el trabajo.');
          }
        } catch (err) {
          setError('Error al conectar con el servidor.');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    } else {
        setError('ID de trabajo no proporcionado.');
        setLoading(false);
    }
  }, [jobId]);

  if (loading) return <p>Cargando detalles del trabajo...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!job) return <p>Trabajo no encontrado.</p>;

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/jobs">Trabajos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{job.title}</li>
        </ol>
      </nav>
      <h1>{job.title}</h1>
      <div className="card">
        <div className="card-body">
          <p><strong>Descripción:</strong></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
          <hr />
          <p><strong>Ubicación:</strong> {job.location}</p>
          <p><strong>Publicado por:</strong> {job.client?.name || 'No disponible'} ({job.client?.email || 'Email no disponible'})</p>
          <p><strong>Fecha de publicación:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>

        </div>
      </div>
      <button onClick={() => router.back()} className="btn btn-link mt-3">Volver a la lista</button>
    </div>
  );
}
