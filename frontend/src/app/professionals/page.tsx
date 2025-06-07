'use client';

import React, { useEffect, useState } from 'react';
import { getProfessionals, Professional } from '@/services/userService';
import Link from 'next/link';

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const response = await getProfessionals();
        if (response.success && response.data) {
          setProfessionals(response.data);
        } else {
          setError(response.error || 'No se pudieron cargar los profesionales.');
        }
      } catch (err) {
        setError('Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  if (loading) return <p>Cargando profesionales...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1>Profesionales Disponibles</h1>
      {professionals.length === 0 ? (
        <p>No hay profesionales registrados por el momento.</p>
      ) : (
        <div className="row">
          {professionals.map((prof) => (
            <div key={prof._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{prof.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{prof.mainSkill || 'Profesional'}</h6>
                  <p className="card-text">{prof.description?.substring(0,100) || 'Sin descripción detallada.'}{prof.description && prof.description.length > 100 ? '...' : ''}</p>
                  {prof.whatsappNumber && <p className="card-text"><a href={`https://wa.me/${prof.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm">Contactar por WhatsApp</a></p>}
                  <Link href={`/users/${prof._id}/profile`} className="btn btn-primary btn-sm mt-2">Ver Perfil</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
