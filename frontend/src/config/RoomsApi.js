import apiClient from './apiClient';

const RoomsApi = {
  getAllRooms: async (page = 1, size = 9, title = '', minPrice = null, maxPrice = null) => {
    try {
      const params = { page, size };
      if (title) params.title = title;
      if (minPrice !== null) params.minPrice = minPrice;
      if (maxPrice !== null) params.maxPrice = maxPrice;
      const response = await apiClient.get('/api/rooms', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllRoomsAdmin: async (page = 1, size = 10) => {
    try {
      const response = await apiClient.get(`/api/rooms/admin?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRoomById: async (id) => {
    try {
      const response = await apiClient.get(`/api/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createRoom: async (roomData) => {
    try {
      const response = await apiClient.post('/api/rooms/add', roomData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateRoom: async (id, roomData) => {
    try {
      const response = await apiClient.put(`/api/rooms/update/${id}`, roomData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteRoom: async (id) => {
    try {
      await apiClient.delete(`/api/rooms/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default RoomsApi;