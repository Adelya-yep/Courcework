import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/ResetPassword.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await apiClient.get(`/api/auth/reset-password?token=${token}`);
        if (response.status === 200) {
          setIsValidToken(true);
        }
      } catch (error) {
        setIsValidToken(false);
        setError('Недействительная или просроченная ссылка для сброса пароля');
      }
    };
    verifyToken();
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      await apiClient.post('/api/auth/reset-password', { token, newPassword });
      setSuccess('Пароль успешно изменен!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при смене пароля');
    }
  };

  if (!isValidToken) {
    return (
      <div className="reset-password-container invalid-token">
        <div className="reset-password-card">
          <h2>Ошибка</h2>
          <p className="error-message">{error}</p>
          <Link to="/forgot-password" className="reset-link">
            Запросить новую ссылку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Сброс пароля</h2>
        <p>Введите новый пароль для вашей учетной записи</p>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label htmlFor="newPassword">Новый пароль</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Введите новый пароль"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите новый пароль"
              required
            />
          </div>
          
          <button type="submit" className="reset-button">
            Сменить пароль
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;