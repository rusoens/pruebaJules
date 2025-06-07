import api from './api';

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  error?: string;
}

export interface UserProfile extends AuthResponse {
    data?: {
        _id: string;
        name: string;
        email: string;
        role: string;
        mainSkill?: string;
        description?: string;
        whatsappNumber?: string;
    }
}

export const register = async (userData: any): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'Error de red o servidor' };
  }
};

export const login = async (credentials: any): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'Error de red o servidor' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): UserProfile | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const getMe = async (): Promise<UserProfile> => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, error: 'Error de red o servidor' };
    }
}
