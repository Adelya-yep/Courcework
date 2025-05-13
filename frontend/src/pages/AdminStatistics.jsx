import React, { useEffect, useState } from 'react';
import roomStatisticsService from '../config/roomStatisticsService';
import RoomPopularityChart from '../components/RoomPopularityChart';
import '../styles/AdminStatistics.css';

const AdminStatistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const data = await roomStatisticsService.getRoomStatistics();
                setStatistics(data);
            } catch (error) {
                console.error('Ошибка загрузки статистики:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, []);

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="admin-statistics">
            <h2>Статистика популярности комнат</h2>
            <RoomPopularityChart data={statistics} />
        </div>
    );
};

export default AdminStatistics;