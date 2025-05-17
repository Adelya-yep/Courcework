import React, { useEffect, useState } from 'react';
import apiClient from '../config/apiClient';
import { Container, Spinner, Table, Form, Modal } from 'react-bootstrap';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiClient.get('/api/users/list');
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ firstName: user.firstName, lastName: user.lastName });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await apiClient.put(`/api/users/update/${editingUser.id}`, formData);
            setUsers(users.map(u => (u.id === updatedUser.data.id ? updatedUser.data : u)));
            setShowModal(false);
            setEditingUser(null);
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await apiClient.delete(`/api/users/delete/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error('Ошибка удаления пользователя:', error);
            }
        }
    };

    if (loading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="secondary" />
        </Container>
    );

    return (
        <Container className="py-4" style={{ maxWidth: '1320px' }}>
            <h2 className="mb-4 text-center" style={{ color: '#948268' }}>Управление пользователями</h2>
            
            <div className="table-responsive">
                <Table striped bordered hover className="shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.phoneNumber || 'Не указан'}</td>
                                <td>{user.email}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Редактировать
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Модальное окно редактирования */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="text-white" style={{ backgroundColor: '#948268' }}>
                    <Modal.Title>Редактировать пользователя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Отмена
                            </button>
                            <button 
                                type="submit" 
                                className="btn text-white"
                                style={{ backgroundColor: '#948268' }}
                            >
                                Сохранить
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UserManagementPage;