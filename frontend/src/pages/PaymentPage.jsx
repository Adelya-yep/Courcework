import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingsApi from '../config/BookingsApi';
import apiClient from '../config/apiClient';
import '../styles/Payment.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Получаем serviceIds (массив ID) и servicePeopleCounts (объект {serviceId: count})
  const {
    roomId,
    checkInDate,
    checkOutDate,
    userId,
    serviceIds: selectedServiceIds, // Переименовали для ясности (это массив ID)
    servicePeopleCounts
  } = location.state || {};

  const [room, setRoom] = useState(null);
  const [detailedServices, setDetailedServices] = useState([]); // Для хранения полных данных о выбранных услугах
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomAndServiceDetails = async () => {
      if (!roomId || !checkInDate || !checkOutDate || !userId) {
        setError('Недостаточно данных для страницы оплаты.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const roomResponse = await apiClient.get(`/api/rooms/${roomId}`);
        setRoom(roomResponse.data);

        let fetchedServicesDetails = [];
        if (selectedServiceIds && selectedServiceIds.length > 0) {
          const servicesResponse = await apiClient.get('/api/services', { params: { page: 1, size: 100 } });
          const allAvailableServices = servicesResponse.data.services;

          if (allAvailableServices) {
            fetchedServicesDetails = allAvailableServices.filter(service =>
                selectedServiceIds.includes(service.serviceId)
            );
            setDetailedServices(fetchedServicesDetails);
          }
        }

        // Расчет цены
        const days = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
        const roomPrice = roomResponse.data.price ? roomResponse.data.price * days : 0;

        const servicesTotalPrice = fetchedServicesDetails.reduce((sum, service) => {
          const count = servicePeopleCounts && servicePeopleCounts[service.serviceId] ? servicePeopleCounts[service.serviceId] : 0;
          let currentServicePrice = service.servicePrice || 0;

          if (count > 0) {
            if (service.pricePerPerson) {
              currentServicePrice *= count;
            }
            // Если !service.pricePerPerson, цена добавляется один раз, если услуга выбрана (count > 0)
          } else {
            currentServicePrice = 0; // Если услуга не выбрана (count=0), ее цена 0
          }
          return sum + currentServicePrice;
        }, 0);

        setTotalPrice(roomPrice + servicesTotalPrice);

      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError('Не удалось загрузить данные для оплаты.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAndServiceDetails();
  }, [roomId, checkInDate, checkOutDate, userId, selectedServiceIds, servicePeopleCounts]);

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
      const bookingData = {
        userId,
        roomId: parseInt(roomId, 10), // Убедимся, что roomId это число
        checkInDate,
        checkOutDate,
        serviceIds: selectedServiceIds || [],
        servicePeopleCounts: servicePeopleCounts || {},
      };
      console.log('Sending booking request (PaymentPage):', bookingData); // Лог перед отправкой
      await BookingsApi.createBooking(bookingData);
      alert('Бронирование успешно оплачено и создано!');
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при бронировании (PaymentPage):', error);
      if (error.message && error.message.includes('Комната уже забронирована')) {
        setError('К сожалению, выбранная комната занята на даты ' + checkInDate + ' – ' + checkOutDate + '. Пожалуйста, выберите другие даты или комнату.');
      } else {
        setError(error.response?.data?.message || error.message || 'Ошибка при бронировании. Пожалуйста, попробуйте позже.');
      }
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

  if (loading) return <div className="loading-container">Загрузка данных для оплаты...</div>;
  if (error && !room) return <div className="error-container">{error}</div>; // Если ошибка до загрузки комнаты

  return (
      <div className="payment-page">
        <h2>Оплата бронирования</h2>
        {room && (
            <div className="booking-info">
              <p><strong>Комната:</strong> {room.roomTitle}</p>
              <p><strong>Дата заезда:</strong> {checkInDate}</p>
              <p><strong>Дата выезда:</strong> {checkOutDate}</p>
              <p>
                <strong>Выбранные услуги:</strong>
                {detailedServices.length > 0
                    ? detailedServices.map(s => `${s.serviceName} (${servicePeopleCounts[s.serviceId] || 0} чел.)`).join(', ')
                    : 'Нет'}
              </p>
              <p><strong>Итоговая цена:</strong> {totalPrice.toFixed(2)} руб.</p>
            </div>
        )}
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
