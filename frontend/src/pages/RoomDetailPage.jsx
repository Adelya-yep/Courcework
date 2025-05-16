import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
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
    <Container className="room-detail py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <Card className="border-0 shadow-sm">
            {/* Заголовок и изображение */}
            <Card.Body className="p-0">
              <div className="ratio ratio-16x9">
                <img 
                  src={room.imageUrl || '/img/room_default.jpg'} 
                  alt={room.roomTitle}
                  className="object-fit-cover"
                />
              </div>
              
              <div className="p-4 p-md-5">
                <Card.Title as="h2" className="mb-4 fs-3 fs-md-2">
                  {room.roomTitle}
                </Card.Title>
                
                <Card.Text className="text-muted mb-4 fs-5">
                  {room.description}
                </Card.Text>
                
                <div className="d-flex align-items-center mb-4">
                  <span className="badge bg-primary fs-6 me-3">
                    {room.price} руб./сутки
                  </span>
                  <span className="text-muted">Номер #{room.roomId}</span>
                </div>
              </div>
            </Card.Body>

            {/* Забронированные даты */}
            <ListGroup variant="flush" className="border-top">
              <ListGroup.Item className="py-3 px-4 px-md-5">
                <h3 className="h5 mb-3">Забронированные даты:</h3>
                {bookings.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {bookings.map((booking) => (
                      <span 
                        key={booking.id}
                        className="badge bg-light text-dark border px-3 py-2"
                      >
                        {booking.checkInDate} — {booking.checkOutDate}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">Нет забронированных дат</p>
                )}
              </ListGroup.Item>
            </ListGroup>

            {/* Кнопка бронирования */}
            <Card.Footer className="border-0 bg-white p-4 p-md-5 pt-0">
              <Button
                as={Link}
                to={`/booking/${room.roomId}`}
                size="lg"
                className="w-100 py-3"
                style={{
                  backgroundColor: '#948268',
                  borderColor: '#948268',
                  '--bs-btn-hover-bg': '#7a6b56',
                  '--bs-btn-hover-border-color': '#7a6b56'
                }}
              >
                Забронировать номер
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RoomDetailPage;