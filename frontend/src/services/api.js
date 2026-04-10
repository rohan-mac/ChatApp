import axios from 'axios';

const getDefaultBaseUrl = () => {
  return 'https://chatapp-pjh9.onrender.com';
};

const RAW_BASE_URL = import.meta.env.VITE_API_URL || getDefaultBaseUrl();
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');
const API_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const shouldRetry = (error) => {
  if (!error.config) return false;
  if ((error.config.__retryCount || 0) >= 3) return false;

  const status = error.response?.status;
  return !status || [408, 425, 429, 500, 502, 503, 504].includes(status);
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  withCredentials: false
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config || !shouldRetry(error)) {
      return Promise.reject(error);
    }

    config.__retryCount = (config.__retryCount || 0) + 1;
    await sleep(800 * config.__retryCount);

    return api(config);
  }
);

export { API_BASE_URL, API_URL };
export default api;
