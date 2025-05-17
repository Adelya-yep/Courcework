import React, { useEffect, useState } from "react";
import ServicesApi from "../config/servicesApi";
import Pagination from "../components/Pagination";
import { Container, Spinner } from "react-bootstrap";

const ServicesManagementPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ serviceName: "", servicePrice: "", imageUrl: "" });
  const [editingService, setEditingService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await ServicesApi.getAllServices(currentPage, itemsPerPage);
        setServices(data.services);
        setTotalItems(data.total);
      } catch (error) {
        console.error("Ошибка загрузки услуг:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    try {
      await ServicesApi.deleteService(id);
      setServices(services.filter((service) => service.serviceId !== id));
      setTotalItems(totalItems - 1);
    } catch (error) {
      console.error("Ошибка удаления услуги:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newService = await ServicesApi.createService({
        serviceName: formData.serviceName,
        servicePrice: parseFloat(formData.servicePrice),
        imageUrl: formData.imageUrl,
      });
      setServices([...services, newService]);
      setFormData({ serviceName: "", servicePrice: "", imageUrl: "" });
      setTotalItems(totalItems + 1);
    } catch (error) {
      console.error("Ошибка создания услуги:", error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingService({ ...editingService, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedService = await ServicesApi.updateService(editingService.serviceId, {
        serviceName: editingService.serviceName,
        servicePrice: parseFloat(editingService.servicePrice),
        imageUrl: editingService.imageUrl,
      });
      setServices(services.map((s) => (s.serviceId === updatedService.serviceId ? updatedService : s)));
      setEditingService(null);
    } catch (error) {
      console.error("Ошибка обновления услуги:", error);
    }
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" variant="secondary" />
    </Container>
  );

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold" style={{ color: '#948268' }}>Управление услугами</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="h5 mb-3">Добавить услугу</h3>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  placeholder="Название услуги"
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  name="servicePrice"
                  value={formData.servicePrice}
                  onChange={handleInputChange}
                  placeholder="Цена"
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="URL картинки"
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#948268' }}>
                  Добавить
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {editingService && (
  <div className="card mb-4 shadow-sm">
    <div className="card-body">
      <h3 className="h5 mb-3">Редактировать услугу</h3>
      <form onSubmit={handleEditSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <input
              type="text"
              name="serviceName"
              value={editingService.serviceName}
              onChange={handleEditInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="servicePrice"
              value={editingService.servicePrice}
              onChange={handleEditInputChange}
              className="form-control"
              step="0.01"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="imageUrl"
              value={editingService.imageUrl || ""}
              onChange={handleEditInputChange}
              placeholder="URL картинки"
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-success flex-grow-1">
              Сохранить изменения
            </button>
            <button
              type="button"
              onClick={() => setEditingService(null)}
              className="btn btn-outline-secondary flex-grow-1"
            >
              Отмена
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}

      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="h5 mb-3">Список услуг</h3>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Картинка</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.serviceId}>
                    <td>{service.serviceId}</td>
                    <td>{service.serviceName}</td>
                    <td>{service.servicePrice.toFixed(2)} ₽</td>
                    <td>
                      {service.imageUrl ? (
                        <a href={service.imageUrl} target="_blank" rel="noopener noreferrer">
                          Просмотр
                        </a>
                      ) : (
                        "Нет"
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => setEditingService(service)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Редакт.
                        </button>
                        <button
                          onClick={() => handleDelete(service.serviceId)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Container>
  );
};

export default ServicesManagementPage;