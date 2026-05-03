import { apiClient } from './apiClient';

export const healthCheck = async (): Promise<string> => {
  const response = await apiClient.get<string>('/health');
  return response.data;
};
