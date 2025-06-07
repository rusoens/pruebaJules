'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getMe, updateUserProfile } from '@/services/authService';
import { Professional } from '@/services/userService';

export default function EditProfilePage() {
  const router = useRouter();
  const { currentUser, isLoading: authLoading, reloadUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mainSkill: '',
    description: '',
    whatsappNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push('/login');
      } else {
        const fetchCurrentProfile = async () => {
            try {
                const profileData = await getMe();
                if (profileData.success && profileData.data) {
                    setFormData({
                        name: profileData.data.name || '',
                        mainSkill: profileData.data.mainSkill || '',
                        description: profileData.data.description || '',
                        whatsappNumber: profileData.data.whatsappNumber || '',
                    });
                } else {
                    setError(profileData.error || "No se pudieron cargar los datos del perfil.");
                }
            } catch (e: any) {
                setError(e.message || "Error cargando perfil.");
            } finally {
                setPageLoading(false);
            }
        };
        fetchCurrentProfile();
      }
    }
  }, [currentUser, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const userIdToUpdate = currentUser?._id || currentUser?.data?._id;
    if (!userIdToUpdate) {
         setError("ID de Usuario no encontrado para la actualización.");
         setLoading(false);
         return;
    }

    try {
      const dataToUpdate: Partial<Professional> = { name: formData.name };
      if (currentUser?.role === 'professional' || currentUser?.data?.role === 'professional') {
          dataToUpdate.mainSkill = formData.mainSkill;
          dataToUpdate.description = formData.description;
          dataToUpdate.whatsappNumber = formData.whatsappNumber;
      }

      const response = await updateUserProfile(userIdToUpdate, dataToUpdate);
      if (response.success && response.data) {
        setSuccess('Perfil actualizado correctamente.');
        reloadUser();
      } else {
        setError(response.error || 'Error al actualizar el perfil.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || pageLoading) return <p>Cargando editor de perfil...</p>;
  if (!currentUser) return null;

  return (
    <div>
      <h2>Editar Mi Perfil</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nameEditInput" className="form-label">Nombre Completo</label>
          <input
            type="text"
            className="form-control"
            id="nameEditInput"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {(currentUser.role === 'professional' || currentUser.data?.role === 'professional') && (
          <>
            <div className="mb-3">
              <label htmlFor="mainSkillEditInput" className="form-label">Oficio Principal</label>
              <input
                type="text"
                className="form-control"
                id="mainSkillEditInput"
                name="mainSkill"
                value={formData.mainSkill}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descriptionEditTextarea" className="form-label">Descripción</label>
              <textarea
                className="form-control"
                id="descriptionEditTextarea"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="whatsappEditInput" className="form-label">WhatsApp</label>
              <input
                type="tel"
                className="form-control"
                id="whatsappEditInput"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
         <button type="button" onClick={() => router.back()} className="btn btn-link ms-2">Cancelar</button>
      </form>
    </div>
  );
}
