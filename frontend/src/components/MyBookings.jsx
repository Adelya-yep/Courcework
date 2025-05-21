import React, { useEffect, useState } from 'react';
import BookingsApi from '../config/BookingsApi';
import useUserStore from '../store/UserStore';
import '../styles/Profile.css'; // Убедись, что стили подключены

const MyBookings = () => {
    const { user } = useUserStore();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user?.id) {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await BookingsApi.fetchUserBookings(user.id);
                    console.log('Fetched bookings data:', data);
                    setBookings(data || []);
                } catch (err) {
                    console.error('Ошибка загрузки бронирований:', err);
                    setError('Не удалось загрузить ваши бронирования.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
            try {
                await BookingsApi.deleteBooking(bookingId);
                setBookings(bookings.filter(b => b.bookingId !== bookingId));
                alert('Бронирование успешно отменено.');
            } catch (err) {
                console.error('Ошибка отмены бронирования:', err);
                alert('Не удалось отменить бронирование.');
            }
        }
    };

    if (loading) {
        return <div>Загрузка бронирований...</div>;
    }

    if (error) {
        return <div className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
    }

    if (!bookings.length) {
        return <div>У вас пока нет бронирований.</div>;
    }

    return (
        <div className="bookings-section">
            {bookings.map((booking) => (
                <div key={booking.bookingId} className="booking">
                    <div className="booking-header">
                        <h4 className="booking-title">
                            Комната: {booking.roomTitle || 'Неизвестная комната'} {/* ИСПРАВЛЕНО */}
                        </h4>
                    </div>
                    <div className="booking-dates">
                        <div className="date-group">
                            <span className="date-label">Дата заезда:</span>
                            <span className="date-value">{booking.checkInDate}</span>
                        </div>
                        <div className="date-group">
                            <span className="date-label">Дата выезда:</span>
                            <span className="date-value">{booking.checkOutDate}</span>
                        </div>
                    </div>

                    {booking.services && booking.services.length > 0 && (
                        <div className="booking-services">
                            <h5 className="services-label">Дополнительные услуги:</h5>
                            <div className="services-list-columns">
                                {booking.services.map((service) => ( // Теперь service это ServiceDto
                                    <div key={service.serviceId} className="service-item-row">
                                        <div className="service-name-col">
                                            {service.serviceName} {/* Должно работать, если serviceName есть в ServiceDto */}
                                        </div>
                                        <div className="service-count-col">
                                            {booking.servicePeopleCounts && typeof booking.servicePeopleCounts[service.serviceId] !== 'undefined'
                                                ? `${booking.servicePeopleCounts[service.serviceId]} чел.`
                                                : 'Кол-во не указано'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="booking-status">
                        <span className="status-label">Статус:</span>
                        <span className="status-value">{booking.status || 'Ожидание'}</span>
                    </div>
                    <div className="booking-total">
                        <span className="total-label" style={{fontWeight: 'bold'}}>Итоговая сумма: </span>
                        <span className="total-value" style={{fontWeight: 'bold'}}>{booking.totalSum} руб.</span>
                    </div>
                    {booking.status !== 'APPROVED' && booking.status !== 'REJECTED' && (
                        <button
                            onClick={() => handleDeleteBooking(booking.bookingId)}
                            className="btn-cancel"
                        >
                            Отменить бронирование
                        </button>
                    )}
                </div>
            ))}
            <style jsx>{`
        .services-list-columns {
          margin-top: 5px;
        }
        .service-item-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px solid #eee;
        }
        .service-item-row:last-child {
          border-bottom: none;
        }
        .service-name-col {
          flex-basis: 70%;
        }
        .service-count-col {
          flex-basis: 30%;
          text-align: right;
        }
        .total-label, .total-value {
             font-weight: bold;
        }
      `}</style>
        </div>
    );
};

export default MyBookings;
