import React from 'react';

const ServiceCheckbox = ({ service, isSelected, onToggle }) => {
    return (
        <div className="service-item">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(service.serviceId)}
            />
            <span>{service.serviceName} - {service.servicePrice} руб.</span>
            {service.imageUrl && <img src={service.imageUrl} alt={service.serviceName} style={{ width: '50px', height: '50px' }} />}
        </div>
    );
};

export default ServiceCheckbox;