import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

const ServicesApi = {
  getAllServices: async (page = 1, size = 9) => {
    try {
      const response = await apiClient.get(`/api/services?page=${page}&size=${size}`);
      return response.data; // Возвращаем объект { services: [], total: number }
    } catch (error) {
      throw error;
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await apiClient.post("/api/services", serviceData); // serviceData включает imageUrl
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const response = await apiClient.put(`/api/services/update/${id}`, serviceData); // serviceData включает imageUrl
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteService: async (id) => {
    try {
      await apiClient.delete(`/api/services/delete/${id}`); // Исправлен путь
    } catch (error) {
      throw error;
    }
  },
};

export default ServicesApi;