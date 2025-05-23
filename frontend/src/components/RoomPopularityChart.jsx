import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RoomPopularityChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="roomTitle" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookingCount" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RoomPopularityChart;