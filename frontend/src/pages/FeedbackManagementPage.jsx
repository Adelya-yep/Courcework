import React, { useEffect, useState } from 'react';
import apiClient from '../config/apiClient';
import '../styles/Admin.css';

const FeedbackManagementPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await apiClient.get('/api/feedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Ошибка загрузки заявок:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const updatedFeedback = await apiClient.put(`/api/feedback/update-status/${id}`, status, {
                headers: { 'Content-Type': 'application/json' },
            });
            setFeedbacks(feedbacks.map(f => (f.id === updatedFeedback.data.id ? updatedFeedback.data : f)));
        } catch (error) {
            console.error('Ошибка обновления статуса заявки:', error);
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="admin-container">
            <h2 className="admin-title">Управление заявками</h2>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Пользователь</th>
                        <th>Сообщение</th>
                        <th>Дата создания</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {feedbacks.map(feedback => (
                        <tr key={feedback.id}>
                            <td>{feedback.username}</td>
                            <td>{feedback.message}</td>
                            <td>{new Date(feedback.createdAt).toLocaleString()}</td>
                            <td>{feedback.status}</td>
                            <td>
                                <select
                                    value={feedback.status}
                                    onChange={(e) => handleStatusChange(feedback.id, e.target.value)}
                                    className="admin-input"
                                >
                                    <option value="В ожидании">В ожидании</option>
                                    <option value="На рассмотрении">На рассмотрении</option>
                                    <option value="Решена">Решена</option>
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

export default FeedbackManagementPage;