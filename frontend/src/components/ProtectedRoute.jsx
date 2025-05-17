import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiClient from '../config/apiClient';
import useUserStore from '../store/UserStore'; // Импортируем стор для проверки роли

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { user, isLoading: isUserLoading } = useUserStore(); // Получаем данные пользователя и состояние загрузки из стора

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/api/auth/check', { withCredentials: true });
        if (response.status === 200) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Ждем загрузки состояния аутентификации И данных пользователя
  if (isLoading || isUserLoading) {
    return <div>Проверка авторизации и данных пользователя...</div>;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь не загружен (на всякий случай, хотя isUserLoading должно это покрыть)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется роль и у пользователя её нет, перенаправляем на главную
  // ИСПРАВЛЕНО: user.role.name сравнивается с requiredRole
  if (requiredRole && user?.role?.name !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;