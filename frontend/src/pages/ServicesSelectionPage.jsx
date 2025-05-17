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
    const [selectedServices, setSelectedServices] = useState({});
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

    const handleServiceToggle = (serviceId, peopleCount) => {
        setSelectedServices((prev) => {
            const newSelected = { ...prev };
            if (peopleCount > 0) {
                newSelected[serviceId] = peopleCount;
            } else {
                delete newSelected[serviceId];
            }
            return newSelected;
        });
    };

    const handleProceedToPayment = () => {
        const serviceIds = Object.keys(selectedServices).map(Number);
        const servicePeopleCounts = selectedServices;
        if (serviceIds.length > 0 && Object.values(servicePeopleCounts).some(count => count <= 0)) {
            setError('Количество человек для каждой услуги должно быть больше 0');
            return;
        }
        navigate('/payment', {
            state: {
                roomId,
                checkInDate,
                checkOutDate,
                userId,
                serviceIds,
                servicePeopleCounts,
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
                    <div key={service.serviceId} className="service-item">
                        <ServiceCheckbox
                            service={service}
                            isSelected={!!selectedServices[service.serviceId]}
                            onToggle={() => {}}
                        />
                        <input
                            type="number"
                            min="0"
                            value={selectedServices[service.serviceId] || 0}
                            onChange={(e) => handleServiceToggle(service.serviceId, parseInt(e.target.value) || 0)}
                        />
                    </div>
                ))}
            </div>
            <button onClick={handleProceedToPayment}>Перейти к оплате</button>
        </div>
    );
};

export default ServicesSelectionPage;