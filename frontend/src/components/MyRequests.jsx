import React, { useState, useEffect } from "react";
import useUserStore from "../store/UserStore";
import FeedbackApi from "../config/FeedbackApi";

const MyRequests = () => {
    const { user } = useUserStore();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await FeedbackApi.getUserFeedback(user.id);
                setRequests(data);
            } catch (error) {
                console.error("Ошибка загрузки заявок:", error);
            }
        };
        fetchRequests();
    }, [user]);

    return (
        <div className="requests-section">
            {requests.map((request) => (
                <div key={request.id} className="request">
                    <p>{request.message}</p>
                    <p>Статус: {request.status}</p>
                </div>
            ))}
        </div>
    );
};

export default MyRequests;