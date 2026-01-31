import { axiosInstance } from '../lib/axios';

// API response wrapper type
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

// Error handler
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server');
  } else {
    // Something else happened
    throw new Error(error.message || 'An error occurred');
  }
};

// Token management
export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
  localStorage.removeItem('authToken');
};

// Initialize auth token from localStorage on app load
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

export default axiosInstance;
