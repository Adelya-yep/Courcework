import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoomsApi from '../config/RoomsApi';
import BookingsApi from '../config/BookingsApi';
import { Link } from 'react-router-dom';

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchRoomAndBookings = async () => {
      try {
        const roomData = await RoomsApi.getRoomById(id);
        setRoom(roomData);
        const bookingData = await BookingsApi.getBookingsByRoom(id);
        setBookings(bookingData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchRoomAndBookings();
  }, [id]);

  if (!room) return <div>Загрузка...</div>;

  return (
    <div className="room-detail">
      <h2>{room.roomTitle}</h2>
      <img src={room.imageUrl || '/img/room_default.jpg'} alt={room.roomTitle} />
      <p>{room.description}</p>
      <p>Цена: {room.price} руб.</p>
      <div>
        <h3>Забронированные даты:</h3>
        {bookings.length > 0 ? (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id}>
                {booking.checkInDate} - {booking.checkOutDate}
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет забронированных дат.</p>
        )}
      </div>
      <Link to={`/booking/${room.roomId}`}>Забронировать</Link>
    </div>
  );
};

export default RoomDetailPage;