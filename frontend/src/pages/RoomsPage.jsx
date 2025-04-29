import React, { useEffect, useState } from 'react';
import RoomsApi from '../config/RoomsApi';
import Pagination from '../components/Pagination';
import RoomCard from '../components/RoomCard';
import '../styles/Rooms.css';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await RoomsApi.getAllRooms(
            currentPage,
            itemsPerPage,
            searchTitle,
            minPrice ? parseFloat(minPrice) : null,
            maxPrice ? parseFloat(maxPrice) : null
        );
        setRooms(data.content || []);
        setTotalItems(data.totalElements || 0);
      } catch (error) {
        console.error('Ошибка загрузки комнат:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [currentPage, searchTitle, minPrice, maxPrice]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTitle(e.target.value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="rooms-page container">
      <h2 className="rooms-title">НАШИ НОМЕРА</h2>
  
      <input
        type="text"
        placeholder="Поиск по названию"
        value={searchTitle}
        onChange={handleSearch}
        className="search-input"
      />
  
      <div className="price-filter">
        <input
          type="number"
          placeholder="Мин. цена"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="price-input"
          min="0"
        />
        <input
          type="number"
          placeholder="Макс. цена"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="price-input"
          min="0"
        />
      </div>
  
      <div className="rooms-list">
        {rooms.map((room) => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </div>
  
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RoomsPage;