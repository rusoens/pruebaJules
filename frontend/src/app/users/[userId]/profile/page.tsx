'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Para App Router
import { getUserProfile, Professional } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string; // Obtener userId de los parámetros de la ruta
  const { currentUser } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await getUserProfile(userId);
          if (response.success && response.data) {
            setProfile(response.data);
          } else {
            setError(response.error || 'No se pudo cargar el perfil.');
          }
        } catch (err) {
          setError('Error al conectar con el servidor.');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
        setError('ID de usuario no proporcionado.');
        setLoading(false);
    }
  }, [userId]);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <p>Perfil no encontrado.</p>;

  return (
    <div>
      <h1>Perfil de {profile.name}</h1>
      <div className="card">
        <div className="card-body">
          <p><strong>Nombre:</strong> {profile.name}</p>
          <p><strong>Rol:</strong> {profile.role === 'professional' ? 'Profesional' : 'Cliente'}</p>
          {profile.role === 'professional' && (
            <>
              <p><strong>Oficio Principal:</strong> {profile.mainSkill || 'No especificado'}</p>
              <p><strong>Descripción:</strong> {profile.description || 'No especificada'}</p>
              {profile.whatsappNumber && (
                <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">{profile.whatsappNumber}</a></p>
              )}
            </>
          )}
          <p><strong>Miembro desde:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>

          {currentUser && (currentUser._id === profile._id || currentUser.data?._id === profile._id) && (
             <Link href="/profile/edit" className="btn btn-secondary mt-3">Editar mi Perfil</Link>
          )}
        </div>
      </div>
       <button onClick={() => router.back()} className="btn btn-link mt-3">Volver</button>
    </div>
  );
}
