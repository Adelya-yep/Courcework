import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingsApi from '../config/BookingsApi';
import '../styles/Payment.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomTitle, checkInDate, checkOutDate, totalPrice, roomId, userId } = location.state || {};

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState(null);

  // Маска для номера карты (автоматическое добавление пробелов)
  const formatCardNumber = (value) => {
    // Удаляем все нецифровые символы
    const v = value.replace(/\D/g, '');
    
    // Добавляем пробел после каждых 4 цифр
    let formatted = '';
    for (let i = 0; i < v.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += v[i];
    }
    
    return formatted.slice(0, 19); // Ограничиваем 16 цифр + 3 пробела
  };

  // Маска для срока действия (автоматическое добавление /)
  const formatExpiryDate = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async () => {
    setError(null);

    // Удаляем пробелы и / для валидации
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const cleanExpiryDate = expiryDate.replace(/\//g, '');

    if (!validateCardNumber(cleanCardNumber)) {
      setError('Некорректный номер карты (должен быть 16 цифр)');
      return;
    }
    if (!validateExpiryDate(cleanExpiryDate)) {
      setError('Некорректный срок действия (формат MM/YY)');
      return;
    }
    if (!validateCvc(cvc)) {
      setError('Некорректный CVC (должен быть 3 цифры)');
      return;
    }

    try {
      await BookingsApi.createBooking({
        userId,
        roomId,
        checkInDate,
        checkOutDate,
      });
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при бронировании:', error);
      setError('Ошибка при бронировании. Пожалуйста, попробуйте позже.');
    }
  };

  const validateCardNumber = (number) => /^\d{16}$/.test(number);
  
  const validateExpiryDate = (date) => {
    if (!/^\d{4}$/.test(date)) return false;
    
    const month = parseInt(date.substring(0, 2));
    const year = parseInt(date.substring(2, 4));
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    return (
      month >= 1 && month <= 12 &&
      (year > currentYear || (year === currentYear && month >= currentMonth))
    );
  };
  
  const validateCvc = (cvc) => /^\d{3}$/.test(cvc);

  if (!location.state) {
    return <div className="error-container">Ошибка: данные бронирования не найдены</div>;
  }

  return (
    <div className="payment-page">
      <h2>Оплата бронирования</h2>
      <div className="booking-info">
        <p><strong>Комната:</strong> {roomTitle}</p>
        <p><strong>Дата заезда:</strong> {checkInDate}</p>
        <p><strong>Дата выезда:</strong> {checkOutDate}</p>
        <p><strong>Итоговая цена:</strong> {totalPrice} руб.</p>
      </div>
      
      <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Номер карты</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Срок действия</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              maxLength={5}
              placeholder="MM/YY"
            />
          </div>

          <div className="form-group">
            <label>CVC</label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
              maxLength={3}
              placeholder="123"
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="button" onClick={handlePayment}>Оплатить</button>
      </form>
    </div>
  );
};

export default PaymentPage;