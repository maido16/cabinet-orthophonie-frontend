import axios from 'axios';
// ✅ On importe 'blogPosts' car c'est le nom de la variable dans votre fichier
import { blogPosts as localData } from '../data/blogPosts'; 

const API_URL = 'http://localhost:8000/api/blog';

// ✅ CONVERSION INTELLIGENTE :
// On adapte vos données locales pour qu'elles aient la même structure que l'API
const localPosts = localData.map(post => ({
  ...post,
  id: `local-${post.id}`,       // ID unique pour React
  isLocal: true,
  image_url: post.image,        // On transforme 'image' en 'image_url'
  description: post.excerpt     // On transforme 'excerpt' en 'description'
}));

export const blogService = {
  // 1. Récupérer TOUS les articles
  getAllPosts: async () => {
    try {
      // API (Web)
      const response = await axios.get(`${API_URL}/posts/`);
      const webPosts = response.data;

      // Fusion : Locaux d'abord, Web ensuite
      return [...localPosts, ...webPosts];
    } catch (error) {
      console.error("Mode hors ligne (API inaccessible):", error);
      return localPosts;
    }
  },

// 2. Récupérer UN article par ID
getPostById: async (id) => {
  const strId = String(id);

  // CAS 1 : C'est un article LOCAL (commence par "local-")
  if (strId.startsWith('local-')) {
    return localPosts.find(post => post.id === strId);
  }

  // CAS 2 : C'est un article WEB (API Django)
  try {
    // ✅ OPTIMISATION : On demande directement l'article précis via son ID
    // Au lieu de tout charger et filtrer
    const response = await axios.get(`${API_URL}/posts/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article web", error);
    return null;
  }
}
};