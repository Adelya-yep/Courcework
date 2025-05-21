import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import useUserStore from '../store/UserStore';
import logo from '/img/logo-dark.svg';

const Header = () => {
  const navigate = useNavigate();
  const { isAuth, user, isLoading, checkAuth, logout } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (isLoading) {
    return <div className="header-loading">Загрузка...</div>;
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Логотип" className="logo-image" />
            </Link>
          </div>

          {/* Бургер-кнопка */}
          <button 
            className={`burger-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Меню"
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>

          {/* Основная навигация */}
          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={closeMenu}>Главная</Link>
              </li>
              <li className="nav-item">
                <Link to="/rooms" className="nav-link" onClick={closeMenu}>Номера</Link>
              </li>
              <li className="nav-item">
                <Link to="/services" className="nav-link" onClick={closeMenu}>Услуги</Link>
              </li>
              <li className="nav-item">
                <Link to="/support" className="nav-link" onClick={closeMenu}>Поддержка</Link>
              </li>
            </ul>
          </nav>

          {/* Навигация авторизации */}
          <div className={`auth-section ${isMenuOpen ? 'open' : ''}`}>
            {!isAuth ? (
              <div className="auth-buttons">
                <Link to="/register" className="auth-btn register" onClick={closeMenu}>Регистрация</Link>
                <Link to="/login" className="auth-btn login" onClick={closeMenu}>Вход</Link>
              </div>
            ) : (
              <div className="user-section">
                <Link to="/profile" className="profile-link" onClick={closeMenu}>
                  {user?.username || 'Профиль'}
                </Link>
                <button onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;