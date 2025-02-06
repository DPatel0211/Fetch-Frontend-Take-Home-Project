import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from './config';
import { APIError } from '../../utils/ErrorHandling';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Session expired
      window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
      return Promise.reject(new APIError(
        'Your session has expired. Please login again.',
        401,
        'SESSION_EXPIRED'
      ));
    }

    if (!error.response) {
      // Network error
      return Promise.reject(new APIError(
        'Unable to connect to the server. Please check your internet connection.',
        0,
        'NETWORK_ERROR'
      ));
    }

    return Promise.reject(new APIError(
      error.response.data?.message || 'An unexpected error occurred.',
      error.response.status
    ));
  }
);
