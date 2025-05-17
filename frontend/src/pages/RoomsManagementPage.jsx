import React, { useEffect, useState } from 'react';
import RoomsApi from '../config/RoomsApi';
import BookingsApi from '../config/BookingsApi';
import Pagination from '../components/Pagination';
import '../styles/Admin.css';
import { Modal } from 'bootstrap';

const RoomsManagementPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [formData, setFormData] = useState({ 
    roomTitle: '', 
    roomType: '', 
    description: '', 
    price: 0, 
    status: 'FREE', 
    imageUrl: '' 
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const itemsPerPage = 10;

  const primaryColor = "#948268";
  const lightColor = "#f8f9fa";

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await RoomsApi.getAllRoomsAdmin(currentPage, itemsPerPage);
        setRooms(data.content || []);
        setTotalItems(data.totalElements || 0);
      } catch (error) {
        console.error('Ошибка загрузки комнат:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.roomTitle.length > 255) {
      alert('Название комнаты не должно превышать 255 символов');
      return;
    }
    if (formData.roomType.length > 255) {
      alert('Тип комнаты не должен превышать 255 символов');
      return;
    }
    if (formData.description.length > 255) {
      alert('Описание не должно превышать 255 символов');
      return;
    }
    if (formData.status.length > 255) {
      alert('Статус не должен превышать 255 символов');
      return;
    }
    if (formData.imageUrl.length > 255) {
      alert('URL изображения не должен превышать 255 символов');
      return;
    }

    try {
      const newRoom = await RoomsApi.createRoom(formData);
      setRooms([...rooms, newRoom]);
      setFormData({ roomTitle: '', roomType: '', description: '', price: 0, status: 'FREE', imageUrl: '' });
    } catch (error) {
      console.error('Ошибка создания комнаты:', error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRoom({ ...editingRoom, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editingRoom.roomTitle.length > 255) {
      alert('Название комнаты не должно превышать 255 символов');
      return;
    }
    if (editingRoom.roomType.length > 255) {
      alert('Тип комнаты не должен превышать 255 символов');
      return;
    }
    if (editingRoom.description.length > 255) {
      alert('Описание не должно превышать 255 символов');
      return;
    }
    if (editingRoom.status.length > 255) {
      alert('Статус не должен превышать 255 символов');
      return;
    }
    if (editingRoom.imageUrl.length > 255) {
      alert('URL изображения не должен превышать 255 символов');
      return;
    }

    try {
      const updatedRoom = await RoomsApi.updateRoom(editingRoom.roomId, editingRoom);
      setRooms(rooms.map((r) => (r.roomId === updatedRoom.roomId ? updatedRoom : r)));
      setEditingRoom(null);
    } catch (error) {
      console.error('Ошибка обновления комнаты:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту комнату?')) {
      try {
        await RoomsApi.deleteRoom(id);
        setRooms(rooms.filter((r) => r.roomId !== id));
      } catch (error) {
        console.error('Ошибка удаления комнаты:', error);
      }
    }
  };

  const handleViewBookings = async (roomId) => {
    try {
      const bookingsData = await BookingsApi.getBookingsByRoom(roomId);
      setBookings(bookingsData);
      setShowBookingsModal(true);
    } catch (error) {
      console.error('Ошибка загрузки бронирований:', error);
      setBookings([]);
    }
  };

  const closeBookingsModal = () => {
    setShowBookingsModal(false);
    setBookings(null);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  );

  return (
    <div className="container container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 text-center" style={{ color: primaryColor }}>Управление комнатами</h2>
          
          {/* Форма добавления комнаты */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header" style={{ backgroundColor: primaryColor, color: 'white' }}>
              <h5 className="mb-0">Добавить новую комнату</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6 col-12">
                  <label htmlFor="roomTitle" className="form-label">Название комнаты</label>
                  <input
                    type="text"
                    className="form-control"
                    id="roomTitle"
                    name="roomTitle"
                    value={formData.roomTitle}
                    onChange={handleInputChange}
                    required
                    maxLength={255}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="roomType" className="form-label">Тип комнаты</label>
                  <input
                    type="text"
                    className="form-control"
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                    maxLength={255}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="description" className="form-label">Описание</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    maxLength={255}
                  />
                </div>
                <div className="col-md-4 col-12">
                  <label htmlFor="price" className="form-label">Цена (руб.)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-4 col-12">
                  <label htmlFor="status" className="form-label">Статус</label>
                  <select 
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="FREE">Свободна</option>
                    <option value="BOOKED">Забронирована</option>
                    <option value="HIDDEN">Снята с показа</option>
                  </select>
                </div>
                <div className="col-md-4 col-12">
                  <label htmlFor="imageUrl" className="form-label">URL изображения</label>
                  <input
                    type="text"
                    className="form-control"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    maxLength={255}
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn" style={{ backgroundColor: primaryColor, color: 'white' }}>
                    Добавить комнату
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Форма редактирования комнаты */}
          {editingRoom && (
            <div className="card mb-4 shadow-sm">
              <div className="card-header" style={{ backgroundColor: primaryColor, color: 'white' }}>
                <h5 className="mb-0">Редактировать комнату</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleEditSubmit} className="row g-3">
                  <div className="col-md-6 col-12">
                    <label htmlFor="editRoomTitle" className="form-label">Название комнаты</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editRoomTitle"
                      name="roomTitle"
                      value={editingRoom.roomTitle}
                      onChange={handleEditInputChange}
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <label htmlFor="editRoomType" className="form-label">Тип комнаты</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editRoomType"
                      name="roomType"
                      value={editingRoom.roomType}
                      onChange={handleEditInputChange}
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="editDescription" className="form-label">Описание</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editDescription"
                      name="description"
                      value={editingRoom.description}
                      onChange={handleEditInputChange}
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="col-md-4 col-12">
                    <label htmlFor="editPrice" className="form-label">Цена (руб.)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="editPrice"
                      name="price"
                      value={editingRoom.price}
                      onChange={handleEditInputChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-4 col-12">
                    <label htmlFor="editStatus" className="form-label">Статус</label>
                    <select
                      className="form-select"
                      id="editStatus"
                      name="status"
                      value={editingRoom.status}
                      onChange={handleEditInputChange}
                    >
                      <option value="FREE">Свободна</option>
                      <option value="BOOKED">Забронирована</option>
                      <option value="HIDDEN">Снята с показа</option>
                    </select>
                  </div>
                  <div className="col-md-4 col-12">
                    <label htmlFor="editImageUrl" className="form-label">URL изображения</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editImageUrl"
                      name="imageUrl"
                      value={editingRoom.imageUrl}
                      onChange={handleEditInputChange}
                      maxLength={255}
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn me-2" style={{ backgroundColor: primaryColor, color: 'white' }}>
                      Сохранить изменения
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingRoom(null)}>
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Список комнат */}
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: primaryColor, color: 'white' }}>
              <h5 className="mb-0">Список комнат</h5>
            </div>
            <div className="card-body">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {rooms.map((room) => (
                  <div key={room.roomId} className="col">
                    <div className="card h-100">
                      {room.imageUrl && (
                        <img 
                          src={room.imageUrl} 
                          className="card-img-top" 
                          alt={room.roomTitle}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{room.roomTitle}</h5>
                        <p className="card-text">
                          <small className="text-muted">Тип: {room.roomType}</small>
                        </p>
                        <p className="card-text">{room.description}</p>
                        <p className="card-text">
                          <strong>Цена: {room.price} руб.</strong>
                        </p>
                        <p className="card-text">
                          Статус: 
                          <span className={`badge ${room.status === 'FREE' ? 'bg-success' : room.status === 'BOOKED' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                            {room.status === 'FREE' ? 'Свободна' : room.status === 'BOOKED' ? 'Забронирована' : 'Снята с показа'}
                          </span>
                        </p>
                      </div>
                      <div className="card-footer bg-transparent">
                        <div className="d-flex flex-wrap gap-2">
                          <button 
                            onClick={() => setEditingRoom(room)}
                            className="btn btn-sm btn-outline-primary flex-grow-1"
                          >
                            Редактировать
                          </button>
                          <button 
                            onClick={() => handleDelete(room.roomId)}
                            className="btn btn-sm btn-outline-danger flex-grow-1"
                          >
                            Удалить
                          </button>
                          <button 
                            onClick={() => handleViewBookings(room.roomId)}
                            className="btn btn-sm flex-grow-1"
                            style={{ backgroundColor: primaryColor, color: 'white' }}
                          >
                            Аренды
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Пагинация */}
          <div className="mt-4 d-flex justify-content-center">
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Модальное окно бронирований */}
      <div className={`modal fade ${showBookingsModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showBookingsModal ? 'rgba(0,0,0,0.5)' : '' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: primaryColor, color: 'white' }}>
              <h5 className="modal-title">Бронирования для комнаты</h5>
              <button type="button" className="btn-close" onClick={closeBookingsModal}></button>
            </div>
            <div className="modal-body">
              {bookings && bookings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Логин</th>
                        <th>Почта</th>
                        <th>Дата заезда</th>
                        <th>Дата выезда</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                          <td>{booking.user.username}</td>
                          <td>{booking.user.email}</td>
                          <td>{booking.checkInDate}</td>
                          <td>{booking.checkOutDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info mb-0">Нет бронирований для этой комнаты</div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeBookingsModal}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsManagementPage;