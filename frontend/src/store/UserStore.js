import { create } from 'zustand';
import apiClient from '../config/apiClient';

export const useUserStore = create((set, get) => ({
  isAuth: false,
  isLoading: true,
  user: null, // Данные пользователя, включая роль и photoPath

  // Проверка аутентификации при загрузке
  checkAuth: async () => {
    if (window.location.pathname === '/reset-password') {
      set({ isLoading: false });
      return;
    }
    try {
      const response = await apiClient.get('/api/auth/me', { withCredentials: true });
      if (response.status === 200) {
        set({ isAuth: true, user: response.data, isLoading: false });
        await get().fetchPhotoPath(response.data.id); // Проверяем photoPath после авторизации
      } else if (response.status === 401) {
        set({ isAuth: false, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Неожиданная ошибка при проверке аутентификации:', error);
      set({ isAuth: false, user: null, isLoading: false });
    }
  },

  // Получение photoPath
  fetchPhotoPath: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`, { withCredentials: true });
      if (response.status === 200 && response.data.photoPath) {
        set((state) => ({
          user: { ...state.user, photoPath: response.data.photoPath },
        }));
      }
    } catch (error) {
      console.error('Ошибка при загрузке photoPath:', error);
    }
  },

  // Регистрация пользователя
  register: async (data) => {
    try {
      const response = await apiClient.post('/api/auth/reg', data, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      throw new Error(
          error.response?.data?.message || error.message || 'Ошибка регистрации'
      );
    }
  },

  // Вход пользователя
  login: async (data) => {
    try {
      const response = await apiClient.post('/api/auth/login', data, {
        withCredentials: true,
      });
      if (response.status >= 200 && response.status < 300) {
        set({ isAuth: true, user: response.data.user });
        await get().checkAuth(); // Проверяем аутентификацию и загружаем данные пользователя
      }
      return response;
    } catch (error) {
      throw new Error(
          error.response?.data?.message || error.message || 'Ошибка входа'
      );
    }
  },

  // Выход пользователя
  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout', {}, { withCredentials: true });
      set({ isAuth: false, user: null });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  // Обновление данных пользователя
  setUser: (userData) => set({ user: userData }),
}));

export default useUserStore;