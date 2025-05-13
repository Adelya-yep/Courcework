import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingsApi from '../config/BookingsApi';
import apiClient from '../config/apiClient';
import '../styles/Payment.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, checkInDate, checkOutDate, userId, selectedServices } = location.state || {};
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomAndServices = async () => {
      try {
        const roomResponse = await apiClient.get(`/api/rooms/${roomId}`);
        setRoom(roomResponse.data);

        let selectedServicesData = [];
        if (selectedServices && selectedServices.length > 0) {
          const servicesResponse = await apiClient.get('/api/services');
          const allServices = servicesResponse.data.services;
          selectedServicesData = allServices.filter(service => selectedServices.includes(service.serviceId));
          setServices(selectedServicesData);
        }

        // Вычисление totalPrice с проверками
        const days = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
        const roomPrice = roomResponse.data.price ? roomResponse.data.price * days : 0;
        const servicesPrice = selectedServicesData.reduce((sum, service) => {
          return sum + (service.servicePrice ? service.servicePrice : 0);
        }, 0);
        setTotalPrice(roomPrice + servicesPrice);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setError('Не удалось загрузить данные');
      }
    };

    if (roomId && checkInDate && checkOutDate) {
      fetchRoomAndServices();
    }
  }, [roomId, checkInDate, checkOutDate, selectedServices]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < v.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += v[i];
    }
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  const handlePayment = async () => {
    setError(null);

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
        serviceIds: selectedServices,
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

  if (!location.state || !room) return <div className="error-container">Загрузка...</div>;

  return (
      <div className="payment-page">
        <h2>Оплата бронирования</h2>
        <div className="booking-info">
          <p><strong>Комната:</strong> {room.roomTitle}</p>
          <p><strong>Дата заезда:</strong> {checkInDate}</p>
          <p><strong>Дата выезда:</strong> {checkOutDate}</p>
          <p><strong>Выбранные услуги:</strong> {services.map(s => s.serviceName).join(', ') || 'Нет'}</p>
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