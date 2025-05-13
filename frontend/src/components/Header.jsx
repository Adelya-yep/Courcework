// components/Header.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import '../App.css';
import useUserStore from '../store/UserStore';
import logo from '/img/logo-dark.svg';


const Header = () => {
  const navigate = useNavigate();
  const { isAuth, user, isLoading, checkAuth, logout } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await logout();
      if (!useUserStore.getState().isAuth) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      // alert('Не удалось выйти. Попробуйте ещё раз.');
    }
  };

  if (isLoading) {
    return <div className="header-loading">Загрузка...</div>;
  }

  return (
    <header className="header">
      <div className="header-content container">
        <div className="logo"><img src={logo} alt="Логотип" className="logo-image" /></div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/rooms">Номера</Link></li>
            <li><Link to="/services">Услуги</Link></li>
            <li><Link to="/">О нас</Link></li>
            <li><Link to="/support">Поддержка</Link></li>
          </ul>
        </nav>
        <nav className="auth-nav">
          <ul>
            {!isAuth ? (
              <>
                <li><Link to="/register">Регистрация</Link></li>
                <li><Link to="/login">Вход</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/profile">{user?.username || 'Профиль'}</Link></li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Выйти
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;