import apiClient from './apiClient';

const roomStatisticsService = {
    getRoomStatistics: async () => {
        try {
            const response = await apiClient.get('/api/rooms/statistics');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default roomStatisticsService;