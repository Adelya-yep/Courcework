import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true // Оставляем для кук, если они нужны для других целей
});

apiClient.interceptors.request.use(
    (config) => {
        // Извлекаем токен из кук (предполагаем, что он называется "jwt")
        const token = document.cookie.split('; ')
            .find(row => row.startsWith('jwt='))
            ?.split('=')[1];
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            return Promise.resolve({ status: 401, data: null });
        }
        return Promise.reject(error);
    }
);

export default apiClient;