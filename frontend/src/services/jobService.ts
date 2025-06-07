import api from './api';

export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  client: {
    _id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
}

export const getJobs = async (): Promise<{ success: boolean, count?: number, data?: Job[], error?: string }> => {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'Error de red o servidor' };
  }
};

export const getJobById = async (jobId: string): Promise<{ success: boolean, data?: Job, error?: string }> => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'Error de red o servidor' };
  }
};

export const createJob = async (jobData: any): Promise<{ success: boolean, data?: Job, error?: string }> => {
  try {
    const response = await api.post('/jobs', jobData);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'Error de red o servidor' };
  }
};
