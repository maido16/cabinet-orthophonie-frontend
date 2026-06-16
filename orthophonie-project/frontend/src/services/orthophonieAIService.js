import api from './api';

const API_BASE_URL = '/orientation';

export const orthophonieAIService = {
  
  async createTest(childData) {
    try {
      const response = await api.post(`${API_BASE_URL}/tests/create/`, childData);
      return response.data;
    } catch (error) {
      console.error('Erreur createTest:', error);
      throw new Error(error.response?.data?.error || 'Erreur lors de la création du test');
    }
  },

  async getQuestions() {
    try {
      const response = await api.get(`${API_BASE_URL}/questions/`);
      return response.data;
    } catch (error) {
      console.error('Erreur getQuestions:', error);
      throw error;
    }
  },

  async submitTest(testId, responses) {
    try {
      const response = await api.post(`${API_BASE_URL}/tests/submit/`, {
        test_id: testId,
        responses: responses
      });
      return response.data;
    } catch (error) {
      console.error('Erreur submitTest:', error);
      throw new Error(error.response?.data?.error || "Erreur lors de l'analyse AI");
    }
  },

  async getResults(testId) {
    try {
      const response = await api.get(`${API_BASE_URL}/tests/${testId}/results/`);
      return response.data;
    } catch (error) {
      console.error('Erreur getResults:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const response = await api.get(`${API_BASE_URL}/tests/stats/`);
      return response.data;
    } catch (error) {
      return { total_tests: 0, completed_tests: 0 };
    }
  },

  async checkBackendHealth() {
    try {
      const response = await api.get(`${API_BASE_URL}/questions/`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};