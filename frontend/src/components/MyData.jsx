import React, { useState, useEffect } from "react";
import useUserStore from "../store/UserStore";
import apiClient from "../config/apiClient";
import ProfilePhoto from "../components/ProfilePhoto";

const MyData = () => {
    const { user, setUser } = useUserStore();
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setPhoneNumber(user?.phoneNumber || "");
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await apiClient.put(
                `/api/users/profile/${user.id}`,
                { firstName, lastName, phoneNumber },
                { withCredentials: true }
            );
            setUser(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Ошибка при обновлении профиля:", error);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await apiClient.post(
                `/api/users/profile/${user.id}/uploadPhoto`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            setUser(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке фотографии:", error);
        }
    };

    return (
        <div>
            <div className="form-group">
                <label className="form-label">Фотография профиля:</label>
                <ProfilePhoto photoPath={user.photoPath} />
                {isEditing && (
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        onChange={handlePhotoUpload}
                        className="form-input"
                    />
                )}
            </div>
            <div className="form-group">
                <label className="form-label">Имя:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="form-input"
                    />
                ) : (
                    <p>{firstName}</p>
                )}
            </div>
            <div className="form-group">
                <label className="form-label">Фамилия:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="form-input"
                    />
                ) : (
                    <p>{lastName}</p>
                )}
            </div>
            <div className="form-group">
                <label className="form-label">Телефон:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="form-input"
                    />
                ) : (
                    <p>{phoneNumber}</p>
                )}
            </div>
            <div className="form-group">
                <label className="form-label">Email:</label>
                <p>{user.email}</p>
            </div>
            {isEditing ? (
                <button onClick={handleSave} className="btn btn-save">
                    Сохранить
                </button>
            ) : (
                <button onClick={handleEdit} className="btn btn-edit">
                    Редактировать
                </button>
            )}
        </div>
    );
};

export default MyData;