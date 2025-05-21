import React, { useEffect, useState } from "react";
import ServicesApi from "../config/servicesApi";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import '../styles/Service.css';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await ServicesApi.getAllServices(currentPage, itemsPerPage);
        console.log("API response:", data);
        setServices(data.services || []);
        setTotalItems(data.total || 0);
      } catch (error) {
        console.error("Ошибка загрузки услуг:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <section className="services">
      <div className="container">
        <div className="services__top-content">
          <h2 className="services-title">ПАКЕТЫ УСЛУГ</h2>
          <Link className="services__link" to="/">На главную</Link>
        </div>
        <div className="services__bottom-content services-cards">
          {services.map((service) => (
            <div className="card__item" key={service.serviceId}>
              <img
                src={service.imageUrl || "/img/service_default.jpg"}
                alt={service.serviceName}
                onError={(e) => { e.target.src = "/img/service_default.jpg"; }}
              />
              <div className="card-text">
                <h3 className="card-title">{service.serviceName}</h3>
                <p>Описание услуги можно добавить в API</p>
                <p className="card-text__price"><span>{service.servicePrice}</span> руб</p>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default ServicesPage;