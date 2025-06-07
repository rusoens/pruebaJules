import api from './api';

export interface Professional {
  _id: string;
  name: string;
  email?: string; // Email podría ser privado
  role: string;
  mainSkill?: string;
  description?: string;
  whatsappNumber?: string;
  createdAt: string;
}

export const getProfessionals = async (): Promise<{ success: boolean, count?: number, data?: Professional[], error?: string }> => {
  try {
    const response = await api.get('/users/professionals');
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'Error de red o servidor' };
  }
};

export const getUserProfile = async (userId: string): Promise<{ success: boolean, data?: Professional, error?: string }> => {
  try {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'Error de red o servidor' };
  }
};

export const updateUserProfile = async (userId: string, profileData: any): Promise<{ success: boolean, data?: Professional, error?: string }> => {
  try {
    const response = await api.put(`/users/${userId}/profile`, profileData);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'Error de red o servidor' };
  }
};
