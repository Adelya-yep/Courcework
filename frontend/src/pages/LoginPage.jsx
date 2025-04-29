import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '../store/UserStore';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, isAuth } = useUserStore();

  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ username, password });
    } catch (error) {
      if (error.message.includes('Network Error') || !error.response) {
        setError('Проблемы с соединением. Проверьте CORS на сервере.');
      } else {
        setError(
          error.response?.data?.message || 
          error.message || 
          'Неверные учетные данные'
        );
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-center-container">
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Вход</h2>
            {error && <div className="error-message">{error}</div>}

            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Имя пользователя"
              required
              autoComplete="username"
              className="form-input"
            />
            
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              required
              autoComplete="current-password"
              className="form-input"
            />
            
            <button type="submit" className="submit-button">
              Войти
            </button>
            
            <div className="register-link">
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </div>
            <div className="forgot-password-link">
              Забыли пароль? <Link to="/forgot-password">Восстановить</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;