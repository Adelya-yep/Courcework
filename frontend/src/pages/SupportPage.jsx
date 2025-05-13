import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import '../styles/Support.css';


const SupportPage = () => {
    return (
        <div className="support-page">
            <h2>Обратная связь</h2>
            <p>Оставьте ваше сообщение, и мы свяжемся с вами!</p>
            <FeedbackForm />
        </div>
    );
};

export default SupportPage;