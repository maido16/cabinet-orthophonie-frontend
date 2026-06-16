import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// 1. Intercepteur de requête : attache le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Intercepteur de réponse : rafraîchit le token s'il est expiré (Erreur 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si on reçoit une erreur 401 (Unauthorized) et qu'on n'a pas encore réessayé
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh');
      
      if (refresh) {
        try {
          // On demande un nouveau token d'accès
          const { data } = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
          
          // On sauvegarde le nouveau token
          localStorage.setItem('access', data.access);
          
          // On met à jour l'en-tête de la requête échouée et on la relance
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
          
        } catch (refreshError) {
          // Si le refresh token est lui aussi expiré, on déconnecte l'utilisateur
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Pas de refresh token disponible, on déconnecte
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;