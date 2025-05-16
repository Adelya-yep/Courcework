import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
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
        setBookedDates(dates);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchRoomAndBookings();
  }, [roomId]);

  const handleProceedToServices = () => {
    if (!checkInDate || !checkOutDate) {
      setError('Пожалуйста, выберите даты заезда и выезда');
      return;
    }
    navigate('/services-selection', {
      state: {
        roomId,
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
        userId: user.id,
      },
    });
  };

  if (!room) return <div>Загрузка...</div>;

  return (
    <Container className="booking-page py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3 p-md-4">
              {/* Заголовок и фото */}
              <div className="text-center mb-4">
                <h2 className="h3 mb-3">Бронирование: {room.roomTitle}</h2>
                <div className="ratio ratio-16x9 mb-3 rounded-3 overflow-hidden">
                  <img 
                    src={room.imageUrl || '/img/room_default.jpg'} 
                    alt={room.roomTitle} 
                    className="object-fit-cover"
                  />
                </div>
                {/* <Badge pill className="fs-5 py-2 px-3" bg="custom">
                  {room.price} руб./ночь
                </Badge> */}
              </div>

              {/* Описание */}
              <Card.Text className="text-center text-muted mb-4">
                {room.description}
              </Card.Text>

              {/* Выбор дат */}
              <div className="mb-4">
                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label">Дата заезда</label>
                      <DatePicker
                        selected={checkInDate}
                        onChange={date => setCheckInDate(date)}
                        minDate={new Date()}
                        excludeDates={bookedDates}
                        placeholderText="Выберите дату"
                        className="form-control p-2"
                        dayClassName={date => 
                          bookedDates.some(d => 
                            d.getFullYear() === date.getFullYear() &&
                            d.getMonth() === date.getMonth() &&
                            d.getDate() === date.getDate()
                          ) ? 'text-decoration-line-through text-muted' : ''
                        }
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label">Дата выезда</label>
                      <DatePicker
                        selected={checkOutDate}
                        onChange={date => setCheckOutDate(date)}
                        minDate={checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date()}
                        excludeDates={bookedDates}
                        placeholderText="Выберите дату"
                        className="form-control p-2"
                        dayClassName={date => 
                          bookedDates.some(d => 
                            d.getFullYear() === date.getFullYear() &&
                            d.getMonth() === date.getMonth() &&
                            d.getDate() === date.getDate()
                          ) ? 'text-decoration-line-through text-muted' : ''
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Ошибки */}
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Кнопка */}
              <div className="text-center">
                <Button
                  onClick={handleProceedToServices}
                  size="lg"
                  className="px-5 py-3 fw-bold"
                  style={{
                    backgroundColor: '#948268',
                    borderColor: '#948268',
                    '--bs-btn-hover-bg': '#7a6b56',
                    '--bs-btn-hover-border-color': '#7a6b56'
                  }}
                >
                  Продолжить оформление
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;