import axiosInstance, { handleApiError } from './api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  rollNumber: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

// User Service
class UserService {
  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User> {
    try {
      const response = await axiosInstance.post('/user/email', { email });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get('/user/profile');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await axiosInstance.patch('/user/profile', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

export default new UserService();
