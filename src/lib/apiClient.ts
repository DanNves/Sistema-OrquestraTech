import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api', // Adjust port if your server runs elsewhere
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken'); // Or however you store the token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
