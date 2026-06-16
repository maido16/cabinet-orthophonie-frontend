import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Enregistrer les tokens
const setTokens = (access, refresh) => {
  localStorage.setItem('access', access);
  if (refresh) localStorage.setItem('refresh', refresh);
};

// Récupérer les tokens
export const getAccessToken = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');

// Supprimer les tokens (logout)
const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

// Appels API
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/token/`, { email, password });
  setTokens(response.data.access, response.data.refresh);
  return response.data;
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, userData);
    
    // ✅ ON RETOURNE TOUT SIMPLEMENT LES DONNÉES
    // On ne cherche plus "response.data.tokens" car Django n'envoie pas de tokens ici
    return response.data; 
    
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("❌ REJET DJANGO REGISTRATION :", error.response.data);
    }
    throw error;
  }
};

export const logout = () => {
  clearTokens();
};

// Intercepteur de requête : attache le token
axios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : rafraîchit automatiquement si 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/token/refresh/`, { refresh });
          setTokens(data.access, null); // refresh reste inchangé
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);