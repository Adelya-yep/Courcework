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
};

export default FeedbackApi;