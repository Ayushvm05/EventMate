import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      // Removed the .substring() log to prevent crashes
      console.log("Token attached to request"); 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;