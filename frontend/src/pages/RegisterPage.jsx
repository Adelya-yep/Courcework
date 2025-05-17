// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterPage.css';
import useUserStore from '../store/UserStore';
import { toast } from 'react-toastify'; // 1. Импортируем toast

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useUserStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: 'Пароли не совпадают' });
        toast.error('Пароли не совпадают'); // Используем toast для ошибки
        setIsLoading(false); // Не забываем сбросить isLoading
        return;
      }

      await register(formData);

      // 2. Заменяем alert на toast.success
      toast.success('Регистрация прошла успешно! Теперь вы можете войти.');
      navigate('/login');

    } catch (error) {
      // Обработка ошибок от UserStore (которые теперь включают сообщение от API)
      if (error.message) {
        toast.error(error.message);
        // Если вы хотите также отображать ошибки по полям, как раньше
        // можно попытаться распарсить error.message или адаптировать UserStore
        // чтобы он возвращал структурированные ошибки, если это необходимо.
        // Пока оставим только общую ошибку в toast.
        setErrors({ general: error.message });
      } else if (error.response && error.response.data) {
        // Этот блок может быть полезен, если UserStore не обрабатывает ошибку полностью
        const apiErrors = error.response.data;
        setErrors(apiErrors);
        // Показать первую ошибку из ответа API или общую
        const firstErrorKey = Object.keys(apiErrors)[0];
        const errorMessage = typeof apiErrors === 'string' ? apiErrors : apiErrors[firstErrorKey] || 'Ошибка регистрации. Пожалуйста, проверьте введенные данные.';
        toast.error(errorMessage);
      } else {
        console.error('Ошибка регистрации:', error);
        toast.error('Ошибка подключения к серверу. Попробуйте позже.');
        setErrors({ general: 'Ошибка подключения к серверу' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="register-page">
        <div className="register-center-container">
          <div className="register-form-container">
            <form onSubmit={handleSubmit} className="register-form">
              <h2>Регистрация</h2>
              {/* errors.general будет отображаться если вы его установите,
                но основные ошибки теперь через toast */}
              {errors.general && !toast.isActive('general-error') && (
                  <div className="error-message">{errors.general}</div>
              )}

              <div className="form-group">
                <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Введите логин"
                    className="form-control"
                    disabled={isLoading}
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>

              <div className="form-group">
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Введите пароль"
                    className="form-control"
                    disabled={isLoading}
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
                <div className="password-hint">
                  Пароль должен содержать минимум 8 символов, включая заглавную и строчную буквы, цифру и спец. символ (@#$%^&+=!)
                </div>
              </div>

              <div className="form-group">
                <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Подтвердите пароль"
                    className="form-control"
                    disabled={isLoading}
                />
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>

              <div className="form-group">
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Введите email"
                    className="form-control"
                    disabled={isLoading}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                >
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </div>

              <div className="login-link">
                Уже есть аккаунт? <Link to="/login">Войти</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;
