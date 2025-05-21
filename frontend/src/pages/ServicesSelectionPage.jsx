import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../config/apiClient';
import ServiceCheckbox from '../components/ServiceCheckbox';
import '../styles/ServicesSelection.css';

const ServicesSelectionPage = ({}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId, checkInDate, checkOutDate, userId } = location.state || {};
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const primaryColor = "#948268";
    const lightColor = "#f8f9fa";

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
        <div className="container py-4" style={{ maxWidth: '800px' }}>
          <div className="card shadow-sm border-0">
            <div className="card-header py-3" style={{ backgroundColor: primaryColor }}>
              <h2 className="mb-0 text-white text-center">Выберите пакет услуг</h2>
            </div>
            
            <div className="card-body">
              <div className="services-list">
                {services.map((service) => (
                  <div key={service.serviceId} className="d-flex align-items-center justify-content-between mb-3 p-3 border rounded">
                    <div className="d-flex align-items-center">
                      <ServiceCheckbox
                        service={service}
                        isSelected={!!selectedServices[service.serviceId]}
                        onToggle={() => {}}
                      />
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        className="form-control text-center"
                        style={{ width: '80px' }}
                        min="0"
                        max="10"
                        value={selectedServices[service.serviceId] || 0}
                        onChange={(e) => {
                          const value = Math.min(10, Math.max(0, parseInt(e.target.value) || 0));
                          handleServiceToggle(service.serviceId, value);
                        }}
                      />
                      <span className="ms-2"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-footer bg-transparent border-0 d-flex justify-content-center py-4">
              <button 
                onClick={handleProceedToPayment}
                className="btn btn-lg px-5 py-2"
                style={{ 
                  backgroundColor: primaryColor, 
                  color: 'white',
                  transition: 'all 0.3s',
                  border: 'none'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7a6d56'}
                onMouseOut={(e) => e.target.style.backgroundColor = primaryColor}
              >
                Перейти к оплате
              </button>
            </div>
          </div>
        </div>
      );
};

export default ServicesSelectionPage;