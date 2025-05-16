import { Link } from 'react-router-dom';
import '../styles/RoomCard.css';

const RoomCard = ({ room }) => {
  return (
    <div className="card__item no-border">
      <img 
        src={room.imageUrl || '/img/room_default.jpg'} 
        alt={room.roomTitle}
        className="room-image"
      />
      <div className="card-text">
        <div className="card-title">
          <h3>{room.roomTitle}</h3>
        </div>
        <p>{room.description}</p>
        <p className="card-text__price">
          <span>{room.price}</span> руб/сутки
        </p>
      </div>
      <Link 
        to={`/rooms/${room.roomId}`} 
        className="card-btn"
      >
        ЗАБРОНИРОВАТЬ
      </Link>
    </div>
  );
};

export default RoomCard;