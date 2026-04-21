import { apiClient } from './apiClient';

export const getHealthCheck = async () => {
  const response = await apiClient.get('/api/healthcheck');
  return response.data;
};
