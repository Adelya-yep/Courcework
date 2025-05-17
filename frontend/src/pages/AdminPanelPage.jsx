import React from "react";
import { Link } from "react-router-dom";
import "../styles/Admin.css";
import { Container } from "react-bootstrap";

const AdminPanelPage = () => {
    const adminSections = [
        { title: "Управление услугами", path: "/admin/services", icon: "bi bi-list-check" },
        { title: "Управление номерами", path: "/admin/rooms", icon: "bi bi-door-closed" },
        { title: "Управление пользователями", path: "/admin/users", icon: "bi bi-people" },
        { title: "Управление бронированиями", path: "/admin/bookings", icon: "bi bi-calendar-check" },
        { title: "Управление заявками", path: "/admin/feedback", icon: "bi bi-chat-left-text" },
        { title: "Статистика популярности комнат", path: "/admin/statistics", icon: "bi bi-bar-chart" }
    ];

    return (
        <Container className="admin-container">
            <h2 className="admin-title">Админ-панель</h2>
            <p className="admin-subtitle">Добро пожаловать в панель администратора</p>

            <div className="admin-buttons">
                {adminSections.map((section, index) => (
                    <Link to={section.path} className="admin-link" key={index}>
                        <button className="admin-button">
                            <i className={`${section.icon} me-2`}></i>
                            {section.title}
                        </button>
                    </Link>
                ))}
            </div>
        </Container>
    );
};

export default AdminPanelPage;