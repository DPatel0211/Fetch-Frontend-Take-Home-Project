import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

interface LoginCredentials {
  name: string;
  email: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  },

  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      throw new Error('Logout failed. Please try again.');
    }
  }
};
