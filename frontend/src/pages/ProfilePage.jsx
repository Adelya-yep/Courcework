import React, { useEffect, useState } from "react";
import useUserStore from "../store/UserStore";
import { useNavigate } from "react-router-dom";
import MyData from "../components/MyData";
import MyBookings from "../components/MyBookings";
import MyRequests from "../components/MyRequests";
import "../styles/Profile.css";

const ProfilePage = () => {
  const { user, isLoading: isUserLoading } = useUserStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("data");

  useEffect(() => {
    if (!isUserLoading && user) {
      if (user.role?.name === "ROLE_ADMIN") {
        navigate("/admin", { replace: true });
      }
    }
  }, [user, isUserLoading, navigate]);

  if (isUserLoading) {
    return <div>Загрузка данных профиля...</div>;
  }

  if (!user) {
    return <div>Пользователь не авторизован. Пожалуйста, войдите.</div>;
  }

  if (user.role?.name === "ROLE_ADMIN") {
    return null;
  }

  return (
    <div className="container">
      <div className="profile-container">
        <h2 className="profile-title">ПРОФИЛЬ</h2>
        <div className="section-buttons d-flex gap-3 mb-4"> {/* Добавлены Bootstrap классы */}
          <button
            onClick={() => setActiveSection("data")}
            className={`btn ${activeSection === "data" ? 
              'text-white' : 'btn-outline-secondary'} 
              border-0 rounded-0 py-2 px-3`}
            style={{
              backgroundColor: activeSection === "data" ? '#948268' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            Мои данные
          </button>
          <button
            onClick={() => setActiveSection("bookings")}
            className={`btn ${activeSection === "bookings" ? 
              'text-white' : 'btn-outline-secondary'} 
              border-0 rounded-0 py-2 px-3`}
            style={{
              backgroundColor: activeSection === "bookings" ? '#948268' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            Мои бронирования
          </button>
          <button
            onClick={() => setActiveSection("requests")}
            className={`btn ${activeSection === "requests" ? 
              'text-white' : 'btn-outline-secondary'} 
              border-0 rounded-0 py-2 px-3`}
            style={{
              backgroundColor: activeSection === "requests" ? '#948268' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            Мои заявки
          </button>
        </div>
        {activeSection === "data" && <MyData />}
        {activeSection === "bookings" && <MyBookings />}
        {activeSection === "requests" && <MyRequests />}
      </div>
    </div>
  );
};

export default ProfilePage;
