import axios from 'axios';

// Use process.env for Jest/node, fallback to import.meta.env for Vite
const API_KEY = typeof process !== 'undefined' && process.env?.VITE_PEXELS_API_KEY
  ? process.env.VITE_PEXELS_API_KEY
  : import.meta.env.VITE_PEXELS_API_KEY;

// Create a simple in-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache cleanup interval
const CACHE_CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_CLEANUP_INTERVAL);

const api = axios.create({
  baseURL: 'https://api.pexels.com/v1',
  headers: {
    'Authorization': API_KEY || '',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: false
});

// Add request interceptor for caching
api.interceptors.request.use(
  (config) => {
    // Only cache GET requests
    if (config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = cache.get(cacheKey);
      
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
        // Return cached response
        return Promise.reject({
          __CACHE__: true,
          data: cachedResponse.data
        });
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for caching and performance tracking
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }

    // Track API performance
    if (window.performance) {
      const timing = performance.getEntriesByType('resource')
        .find(entry => entry.name.includes(response.config.url || ''));
      
      if (timing && timing.duration > 1000) {
        console.warn(`Slow API response for ${response.config.url}: ${timing.duration}ms`);
      }
    }

    return response;
  },
  (error) => {
    // Handle cached responses
    if (error.__CACHE__) {
      return Promise.resolve({ data: error.data });
    }
    return Promise.reject(error);
  }
);

export default api;