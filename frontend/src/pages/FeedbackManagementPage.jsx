import React, { useEffect, useState } from 'react';
import apiClient from '../config/apiClient';
import { Container, Spinner, Table, Form, Badge } from 'react-bootstrap';

const FeedbackManagementPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await apiClient.get('/api/feedback');
                setFeedbacks(response.data && Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Ошибка загрузки заявок:', error);
                setFeedbacks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const updatedFeedback = await apiClient.put(
                `/api/feedback/update-status/${id}`, 
                { status },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setFeedbacks(feedbacks.map(f => f.id === updatedFeedback.data.id ? updatedFeedback.data : f));
        } catch (error) {
            console.error('Ошибка обновления статуса заявки:', error);
        }
    };

    const getStatusVariant = (status) => {
        switch(status) {
            case 'Решена': return 'success';
            case 'На рассмотрении': return 'warning';
            case 'В ожидании': return 'secondary';
            default: return 'primary';
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{ maxWidth: '1320px' }}>
            <h2 className="mb-4 text-center" style={{ color: '#948268' }}>Управление заявками</h2>
            
            <div className="table-responsive">
                <Table striped bordered hover className="shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th>Пользователь</th>
                            <th>E-mail</th>
                            <th style={{ minWidth: '250px' }}>Сообщение</th>
                            <th>Дата создания</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.length > 0 ? (
                            feedbacks.map(feedback => (
                                <tr key={feedback.id}>
                                    <td>{feedback.username || 'Не указан'}</td>
                                    <td>{feedback.email || 'Не указана'}</td>
                                    <td className="text-break">{feedback.message}</td>
                                    <td>{new Date(feedback.createdAt).toLocaleString()}</td>
                                    <td>
                                        <Badge bg={getStatusVariant(feedback.status)}>
                                            {feedback.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Form.Select 
                                            size="sm"
                                            value={feedback.status}
                                            onChange={(e) => handleStatusChange(feedback.id, e.target.value)}
                                            style={{ minWidth: '160px' }}
                                        >
                                            <option value="В ожидании">В ожидании</option>
                                            <option value="На рассмотрении">На рассмотрении</option>
                                            <option value="Решена">Решена</option>
                                        </Form.Select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Нет данных о заявках
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default FeedbackManagementPage;