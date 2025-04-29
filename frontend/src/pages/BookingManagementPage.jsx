import React, { useEffect, useState } from 'react';
import apiClient from '../config/apiClient';
import '../styles/Admin.css';

const BookingManagementPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await apiClient.get('/api/bookings');
                setBookings(response.data);
            } catch (error) {
                console.error('Ошибка загрузки бронирований:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const updatedBooking = await apiClient.put(`/api/bookings/update-status/${id}`, status, {
                headers: { 'Content-Type': 'application/json' }
            });
            setBookings(bookings.map(b => (b.bookingId === updatedBooking.data.bookingId ? updatedBooking.data : b)));
        } catch (error) {
            console.error('Ошибка обновления статуса бронирования:', error);
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="admin-container">
            <h2 className="admin-title">Управление бронированиями</h2>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Пользователь</th>
                        <th>Комната</th>
                        <th>Дата заезда</th>
                        <th>Дата выезда</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.bookingId}>
                            <td>{booking.user.username}</td>
                            <td>{booking.room.roomTitle}</td>
                            <td>{booking.checkInDate}</td>
                            <td>{booking.checkOutDate}</td>
                            <td>{booking.status}</td>
                            <td>
                                <select
                                    value={booking.status}
                                    onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                                    className="admin-input"
                                >
                                    <option value="PENDING">На рассмотрении</option>
                                    <option value="APPROVED">Одобрено</option>
                                    <option value="REJECTED">Отклонено</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingManagementPage;