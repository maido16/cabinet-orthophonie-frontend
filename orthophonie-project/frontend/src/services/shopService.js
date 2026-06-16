import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/shop/';

// 👇 Le "export const" est crucial ici pour que Shop.jsx puisse le lire avec des accolades { }
export const shopService = {
    // Récupérer tous les produits
    getProducts: async () => {
        const response = await axios.get(`${API_URL}products/`);
        return response.data;
    },
    // 👇 NOUVELLE FONCTION À AJOUTER :
    getProduct: async (id) => {
        const response = await axios.get(`${API_URL}products/${id}/`);
        return response.data;
    },
    // Récupérer les catégories
    getCategories: async () => {
        const response = await axios.get(`${API_URL}categories/`);
        return response.data;
    }
};