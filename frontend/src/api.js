import axios from 'axios';

// In Vercel, backend serverless functions will be available under /api
const BACKEND = import.meta.env.VITE_BACKEND_URL || '/api';

const api = axios.create({
  baseURL: BACKEND,
  withCredentials: true
});

export default api;
