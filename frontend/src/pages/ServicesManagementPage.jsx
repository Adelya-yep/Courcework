import React, { useEffect, useState } from "react";
import ServicesApi from "../config/servicesApi";
import Pagination from "../components/Pagination";
import "../styles/Admin.css";
import "../styles/Pagination.css";

const ServicesManagementPage = () => {
  const [services, setServices] = useState([]); // Начальное значение — пустой массив
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ serviceName: "", servicePrice: "", imageUrl: "" }); // Добавлено imageUrl
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
        imageUrl: formData.imageUrl, // Передаем imageUrl
      });
      setServices([...services, newService]);
      setFormData({ serviceName: "", servicePrice: "", imageUrl: "" }); // Очищаем форму
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
        imageUrl: editingService.imageUrl, // Передаем imageUrl
      });
      setServices(services.map((s) => (s.serviceId === updatedService.serviceId ? updatedService : s)));
      setEditingService(null);
    } catch (error) {
      console.error("Ошибка обновления услуги:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="services-management">
      <h2 className="admin-section-title">Управление услугами</h2>

      <div className="admin-form-container">
        <h3 className="admin-subsection-title">Добавить услугу</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleInputChange}
            placeholder="Название услуги"
            className="admin-input"
            required
          />
          <input
            type="number"
            name="servicePrice"
            value={formData.servicePrice}
            onChange={handleInputChange}
            placeholder="Цена"
            className="admin-input"
            step="0.01"
            required
          />
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="URL картинки"
            className="admin-input"
          />
          <button type="submit" className="admin-button admin-button-primary">
            Добавить услугу
          </button>
        </form>
      </div>

      {editingService && (
        <div className="admin-form-container admin-edit-form">
          <h3 className="admin-subsection-title">Редактировать услугу</h3>
          <form onSubmit={handleEditSubmit} className="admin-form">
            <input
              type="text"
              name="serviceName"
              value={editingService.serviceName}
              onChange={handleEditInputChange}
              placeholder="Название услуги"
              className="admin-input"
              required
            />
            <input
              type="number"
              name="servicePrice"
              value={editingService.servicePrice}
              onChange={handleEditInputChange}
              placeholder="Цена"
              className="admin-input"
              step="0.01"
              required
            />
            <input
              type="text"
              name="imageUrl"
              value={editingService.imageUrl || ""}
              onChange={handleEditInputChange}
              placeholder="URL картинки"
              className="admin-input"
            />
            <div className="admin-form-actions">
              <button type="submit" className="admin-button admin-button-save">
                Сохранить изменения
              </button>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="admin-button admin-button-cancel"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <h3 className="admin-subsection-title">Список услуг</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Картинка</th> {/* Новый столбец для URL */}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {services &&
              services.map((service) => (
                <tr key={service.serviceId}>
                  <td>{service.serviceId}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.servicePrice.toFixed(2)} ₽</td>
                  <td>{service.imageUrl ? <a href={service.imageUrl} target="_blank">Ссылка</a> : "Нет"}</td>
                  <td className="admin-actions">
                    <button
                      onClick={() => setEditingService(service)}
                      className="admin-button admin-button-edit"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(service.serviceId)}
                      className="admin-button admin-button-delete"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ServicesManagementPage;