import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
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
        <div className="p-4 p-md-5 bg-white rounded-3 shadow">
          <h2 className="text-center mb-3">ОБРАТНАЯ СВЯЗЬ</h2>
          <p className="text-center text-muted mb-4">Остались вопросы или возникли сложности? Напишите нам!</p>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите ваше сообщение..."
                className="mb-3"
                style={{
                    minHeight: '200px'
                  }}
              />
            </Form.Group>
      
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {success && <Alert variant="success" className="mb-3">{success}</Alert>}
      
            <Button 
              type="submit" 
              style={{
                backgroundColor: '#948268',
                borderColor: '#948268'
              }}
              className="w-100"
            >
              Отправить
            </Button>
          </Form>
        </div>
      );
};

export default FeedbackForm;