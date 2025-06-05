import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.pexels.com/v1',
  headers: {
    Authorization: import.meta.env.VITE_PEXELS_API_KEY,
  },
});

export default api;