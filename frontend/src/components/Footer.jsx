// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '/img/logo-light.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-logo">
          <img src={logo} alt="Логотип" className="logo-image" />
          <p className="footer-description">
            Пансионат для комфортного отдыха и восстановления
          </p>
        </div>
        
        <nav className="footer-nav">
          <h3 className="footer-title">Навигация</h3>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/rooms">Номера</Link></li>
            <li><Link to="/services">Услуги</Link></li>
            <li><Link to="/about">О нас</Link></li>
            <li><Link to="/contacts">Контакты</Link></li>
          </ul>
        </nav>
        
        <div className="footer-contacts">
          <h3 className="footer-title">Контакты</h3>
          <ul>
            <li>Адрес: Россия, респ. Татарстан, Альметьевский р-н, с. Поташная Поляна,
            ул. Сосновая, 1Б</li>
            <li>Телефон: 8 8553 54 33 32</li>
            <li>Email: lesnaya_dolina@gmail.com</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Пансионат. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;