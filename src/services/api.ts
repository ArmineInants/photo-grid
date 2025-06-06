import axios from 'axios';

// Use process.env for Jest/node, fallback to import.meta.env for Vite
const API_KEY = typeof process !== 'undefined' && process.env?.VITE_PEXELS_API_KEY
  ? process.env.VITE_PEXELS_API_KEY
  : import.meta.env.VITE_PEXELS_API_KEY;

const api = axios.create({
  baseURL: 'https://api.pexels.com/v1',
  headers: {
    Authorization: API_KEY,
  },
});

export default api;