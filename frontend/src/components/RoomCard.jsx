import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/RoomCard.css'

const RoomCard = ({ room }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="service-card__image-container overflow-hidden" style={{ height: '250px' }}>
        <img 
          src={room.imageUrl || '/img/room_default.jpg'} 
          alt={room.roomTitle}
          className="card-img-top h-100 object-fit-cover"
        />
      </div>
      
      <div className="card-body d-flex flex-column">
        <Link 
          to={`/rooms/${room.roomId}`} 
          className="text-decoration-none text-dark"
        >
          <h3 className="card-title h5 mb-3">{room.roomTitle}</h3>
        </Link>
        
        <p className="card-text text-secondary flex-grow-1 mb-3">
          {room.description}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <p className="mb-0">
            <span className="fw-bold text-primary">{room.price}</span> руб/сутки
          </p>
          
          <Link 
            to={`/booking/${room.roomId}`} 
            className="btn btn-primary"
          >
            Забронировать
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;