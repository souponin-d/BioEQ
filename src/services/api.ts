import axios from 'axios';
import { BioEQFormData } from '../types/types';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000'
});

export const sendBioEQRequest = async (payload: BioEQFormData): Promise<void> => {
  await apiClient.post('/api/generate', payload);
};
