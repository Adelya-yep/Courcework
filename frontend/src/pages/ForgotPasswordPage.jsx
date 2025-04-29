import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
  });

  const handleSendResetLink = async () => {
    try {
      const response = await apiClient.post('/api/auth/forgot-password', { email });
      if (response.status === 200) {
        // alert('Ссылка для сброса пароля отправлена на вашу почту');
        navigate('/login');
      }
    } catch (error) {
      // alert('Ошибка: ' + (error.response?.data || 'Неизвестная ошибка'));
    }
  
    // const handleSendResetLink = () => {
    //   // Логика отправки ссылки
    //   console.log('Отправка ссылки на:', email);
    //   // Здесь можно добавить вызов API
    // };
  };
    return (
      <div className="forgot-password-page ">
        <div className="forgot-password-container container">
          <h1 className="forgot-password-title">Забыли пароль?</h1>
          <p className="forgot-password-description">
            Введите email, связанный с вашей учетной записью, и мы вышлем вам ссылку для сброса пароля.
          </p>
  
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            className="forgot-password-input"
          />
  
          <button
            onClick={handleSendResetLink}
            className="forgot-password-button"
          >
            Отправить ссылку
          </button>
  
          <a href="/login" className="back-to-login">
            ← Вернуться на страницу входа
          </a>
        </div>
      </div>
    );
};

export default ForgotPasswordPage;