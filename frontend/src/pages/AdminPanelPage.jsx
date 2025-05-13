import React from "react";
import { Link } from "react-router-dom";
import "../styles/Admin.css";

const AdminPanelPage = () => {
    return (
        <div className="admin-container">
            <h2 className="admin-title">Админ-панель</h2>
            <p className="admin-subtitle">Добро пожаловать в панель администратора</p>

            <div className="admin-buttons">
                <Link to="/admin/services" className="admin-link">
                    <button className="admin-button">
                        Управление услугами
                    </button>
                </Link>
                <Link to="/admin/rooms" className="admin-link">
                    <button className="admin-button">
                        Управление номерами
                    </button>
                </Link>
                <Link to="/admin/users" className="admin-link">
                    <button className="admin-button">
                        Управление пользователями
                    </button>
                </Link>
                <Link to="/admin/bookings" className="admin-link">
                    <button className="admin-button">
                        Управление бронированиями
                    </button>
                </Link>
                <Link to="/admin/feedback" className="admin-link">
                    <button className="admin-button">
                        Управление заявками
                    </button>
                </Link>
                <Link to="/admin/statistics" className="admin-link">
                    <button className="admin-button">
                        Статистика популярности комнат
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default AdminPanelPage;