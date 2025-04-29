import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import apiClient from '../config/apiClient'; // Предполагается, что apiClient настроен для запросов

const Home = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await apiClient.get('/api/rooms/home');
        setRooms(response.data);
      } catch (error) {
        console.error('Ошибка загрузки комнат:', error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="home-page">
      {/* Hero секция */}
      <section className="hero">
        <div className="hero__text container">
          <h1>ПАНСИОНАТ ЛЕСНЫЕ ДАЛИ</h1>
          <p>ВАШ ДОМ ВДАЛИ ОТ ДОМА</p>
        </div>
      </section>

      {/* Секция проживание */}
      <section className="live">
        <div className="container">
          <div className="live__top-content">
            <h2 className="live-title">ПРОЖИВАНИЕ</h2>
            <Link className="live__link" to="/rooms">Смотреть все</Link>
          </div>
          <div className="live__bottom-content live-cards">
            {rooms.map(room => (
              <div className="card__item" key={room.roomId}>
                <img src={room.imageUrl} alt={room.roomTitle} />
                <div className="card-text">
                  <div className="card-title">
                    <h3>{room.roomTitle}</h3>
                  </div>
                  <p>{room.description}</p>
                  <p className="card-text__price"><span>{room.price}</span> руб/сутки</p>
                </div>
                <Link to={`/rooms/${room.roomId}`} className="card-btn">ЗАБРОНИРОВАТЬ</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Секция акции */}
      <section className="sale container">
        <h2>АКЦИИ</h2>
        <Carousel>
          {[
            {
              id: 1,
              img: "/img/pensioners.jpeg",
              title: "СКИДКА ПЕНСИОНЕРАМ",
              desc: "При предъявлении пенсионного удостоверения предоставляется скидка на проживание в размере 10%"
            },
            {
              id: 2,
              img: "/img/happy-birthday.jpg",
              title: "ДЕНЬ РОЖДЕНИЯ",
              desc: "Скидка 10% на проживание за 7 дней до и 7 дней после даты дня рождения."
            },
            {
              id: 3,
              img: "/img/family.jpeg",
              title: "РАННЕЕ БРОНИРОВАНИЕ",
              desc: "Скидка 10% при бронировании за 30 дней до заезда"
            }
          ].map(promo => (
            <Carousel.Item key={promo.id}>
              <img
                className="d-block w-100"
                src={promo.img}
                alt={promo.title}
              />
              <Carousel.Caption>
                <h2>{promo.title}</h2>
                <h4>{promo.desc}</h4>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Секция контакты */}
      <section className="contact container">
        <h2>КОНТАКТЫ</h2>
        <div className="contact__content">
          <div className="contact__text points">
            <div className="map point">
              <img src="/img/pin-map.svg" alt="Адрес" />
              <p>
                Россия, респ. Татарстан, Альметьевский р-н, с. Поташная Поляна,
                ул. Сосновая, 1Б
              </p>
            </div>
            <div className="tel point">
              <img src="/img/phone.svg" alt="Телефон" />
              <p>8 8553 54 33 32</p>
            </div>
            <div className="mail point">
              <img src="/img/mail.svg" alt="Почта" />
              <p>lesnaya_dolina@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;