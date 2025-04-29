import React, { useEffect, useState } from 'react';
import apiClient from '../config/apiClient';
import '../styles/Admin.css';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });

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
            setEditingUser(null);
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/api/users/delete/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="admin-container">
            <h2 className="admin-title">Управление пользователями</h2>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Номер телефона</th>
                        <th>Почта</th>
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
                                <button className="admin-button admin-button-edit" onClick={() => handleEdit(user)}>Редактировать</button>
                                <button className="admin-button admin-button-delete" onClick={() => handleDelete(user.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {editingUser && (
                <div className="admin-form-container">
                    <h3 className="admin-subsection-title">Редактировать пользователя</h3>
                    <form onSubmit={handleSave} className="admin-form">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Имя"
                            className="admin-input"
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Фамилия"
                            className="admin-input"
                            required
                        />
                        <div className="admin-form-actions">
                            <button type="submit" className="admin-button admin-button-save">Сохранить</button>
                            <button type="button" className="admin-button admin-button-cancel" onClick={() => setEditingUser(null)}>Отмена</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;