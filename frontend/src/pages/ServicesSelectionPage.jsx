import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../config/apiClient';
import ServiceCheckbox from '../components/ServiceCheckbox';
import '../styles/ServicesSelection.css';

const ServicesSelectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId, checkInDate, checkOutDate, userId } = location.state || {};
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await apiClient.get('/api/services');
                setServices(response.data.services);
            } catch (error) {
                console.error('Ошибка загрузки услуг:', error);
                setError('Не удалось загрузить услуги');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleServiceToggle = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleProceedToPayment = () => {
        navigate('/payment', {
            state: {
                roomId,
                checkInDate,
                checkOutDate,
                userId,
                selectedServices,
            },
        });
    };

    if (loading) return <div>Загрузка услуг...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="services-selection-page">
            <h2>Выберите дополнительные услуги</h2>
            <div className="services-list">
                {services.map((service) => (
                    <ServiceCheckbox
                        key={service.serviceId}
                        service={service}
                        isSelected={selectedServices.includes(service.serviceId)}
                        onToggle={handleServiceToggle}
                    />
                ))}
            </div>
            <button onClick={handleProceedToPayment}>Перейти к оплате</button>
        </div>
    );
};

export default ServicesSelectionPage;