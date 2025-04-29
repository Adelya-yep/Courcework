import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingsApi from '../config/BookingsApi';
import RoomsApi from '../config/RoomsApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUserStore from '../store/UserStore';
import '../styles/Booking.css';

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [room, setRoom] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomAndBookings = async () => {
      try {
        const roomData = await RoomsApi.getRoomById(roomId);
        setRoom(roomData);

        const bookings = await BookingsApi.getBookingsByRoom(roomId);
        console.log('Полученные бронирования:', bookings);

        const dates = bookings.flatMap(booking => {
          const start = new Date(booking.checkInDate.split('T')[0]);
          const end = new Date(booking.checkOutDate.split('T')[0]);
          const dateArray = [];
          let currentDate = new Date(start);
          while (currentDate <= end) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dateArray;
        });
        console.log('Занятые даты:', dates);
        setBookedDates(dates);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchRoomAndBookings();
  }, [roomId]);

  const handleProceedToPayment = () => {
    if (!checkInDate || !checkOutDate) {
      setError('Пожалуйста, выберите даты заезда и выезда');
      return;
    }
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = days * room.price;

    navigate('/payment', {
      state: {
        roomTitle: room.roomTitle,
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
        totalPrice,
        roomId,
        userId: user.id,
      },
    });
  };

  if (!room) return <div>Загрузка...</div>;

  return (
    <div className="booking-page">
      <h2>Бронирование комнаты: {room.roomTitle}</h2>
      <img src={room.imageUrl || '/img/room_default.jpg'} alt={room.roomTitle} />
      <p>{room.description}</p>
      <p>Цена за ночь: {room.price} руб.</p>
      <DatePicker
        selected={checkInDate}
        onChange={(date) => setCheckInDate(date)}
        minDate={new Date()}
        excludeDates={bookedDates}
        placeholderText="Дата заезда"
        dayClassName={(date) =>
          bookedDates.some(
            (d) =>
              d.getFullYear() === date.getFullYear() &&
              d.getMonth() === date.getMonth() &&
              d.getDate() === date.getDate()
          )
            ? 'booked-date'
            : null
        }
      />
      <DatePicker
        selected={checkOutDate}
        onChange={(date) => setCheckOutDate(date)}
        minDate={checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date()}
        excludeDates={bookedDates}
        placeholderText="Дата выезда"
        dayClassName={(date) =>
          bookedDates.some(
            (d) =>
              d.getFullYear() === date.getFullYear() &&
              d.getMonth() === date.getMonth() &&
              d.getDate() === date.getDate()
          )
            ? 'booked-date'
            : null
        }
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleProceedToPayment}>Оформить</button>
    </div>
  );
};

export default BookingPage;