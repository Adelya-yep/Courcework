import React, { useEffect, useState } from 'react';
import apiClient from '../config/apiClient';
import { Container, Spinner, Table, Form } from 'react-bootstrap';

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

    if (loading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="secondary" />
        </Container>
    );

    return (
        <Container className="py-4">
            <h2 className="mb-4 fw-bold" style={{ color: '#948268' }}>Управление бронированиями</h2>
            
            <div className="table-responsive">
                <Table striped bordered hover className="shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th>Пользователь</th>
                            <th>Комната</th>
                            <th>Дата заезда</th>
                            <th>Дата выезда</th>
                            <th>Услуги и количество человек</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.bookingId}>
                                <td>{booking.user?.username || 'Не указано'}</td>
                                <td>{booking.room?.roomTitle || 'Не указано'}</td>
                                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                <td>
                                    {booking.services && booking.services.length > 0
                                        ? booking.services.map(service => (
                                            <div key={service.serviceId}>
                                                {service.serviceName}: {booking.servicePeopleCounts[service.serviceId] || 0} чел.
                                            </div>
                                        ))
                                        : 'Нет услуг'}
                                </td>
                                <td>
                                    <span className={`badge ${
                                        booking.status === 'APPROVED' ? 'bg-success' :
                                        booking.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
                                    }`}>
                                        {booking.status === 'PENDING' && 'На рассмотрении'}
                                        {booking.status === 'APPROVED' && 'Одобрено'}
                                        {booking.status === 'REJECTED' && 'Отклонено'}
                                    </span>
                                </td>
                                <td>
                                    <Form.Select 
                                        value={booking.status}
                                        onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                                        size="sm"
                                    >
                                        <option value="PENDING">На рассмотрении</option>
                                        <option value="APPROVED">Одобрено</option>
                                        <option value="REJECTED">Отклонено</option>
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default BookingManagementPage;