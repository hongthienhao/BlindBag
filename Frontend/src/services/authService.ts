import { apiClient } from './apiClient';

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },
};
