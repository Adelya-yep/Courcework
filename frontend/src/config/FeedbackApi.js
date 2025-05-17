import apiClient from './apiClient';

const FeedbackApi = {
    createFeedback: async (feedbackData) => {
        try {
            const response = await apiClient.post('/api/feedback/send', feedbackData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Ошибка при отправке сообщения');
        }
    },
    getUserFeedback: async (userId) => {
        try {
            const response = await apiClient.get(`/api/feedback/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Ошибка при загрузке заявок');
        }
    },
};

export default FeedbackApi;