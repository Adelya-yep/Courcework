import React, { useState } from 'react';
import FeedbackApi from '../config/FeedbackApi';
import useUserStore from '../store/UserStore';
import '../styles/Support.css';

const FeedbackForm = () => {
    const { user } = useUserStore();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!message.trim()) {
            setError('Сообщение не может быть пустым');
            return;
        }

        try {
            await FeedbackApi.createFeedback({
                userId: user.id,
                message,
            });
            setSuccess('Сообщение успешно отправлено');
            setMessage('');
        } catch (error) {
            setError('Ошибка при отправке сообщения');
            console.error('Ошибка:', error);
        }
    };

    if (!user) {
        return <div>Пожалуйста, войдите, чтобы оставить отзыв</div>;
    }

    return (
        <div className="feedback-form">
            <h3>Оставьте ваше сообщение</h3>
            <form onSubmit={handleSubmit}>
        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите ваше сообщение..."
            rows="5"
            required
        />
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
};

export default FeedbackForm;