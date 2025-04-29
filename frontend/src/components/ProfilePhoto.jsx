import React from "react";

const ProfilePhoto = ({ photoPath }) => {
    return photoPath ? (
        <img
            src={`http://localhost:8080/upload/${photoPath}`} // Corrected path
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
    ) : (
        <p>Фотография не загружена</p>
    );
};

export default ProfilePhoto;
