import React from 'react';

import "./UserProfile.css";
const DEFAULT_PROFILE_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png?w=740&t=st=1687652085~exp=1687652685~hmac=7b735ef5e0a71bdf37c1c20cdeb1daa41d747bb1a88f4b74b429ed8a2d8cd244";

const UserProfile = ({ userData, onLogout, onGetPrivateKey }) => {
  
  const { name, email, profileImage } = userData;

  const getProfileImage = () => {
    return profileImage || DEFAULT_PROFILE_IMAGE;
  };

  return (
    <div className="user-profile">
      <div className="profile-image">
        <img src={getProfileImage()} alt="Profile" />
      </div>
      <div className="profile-info">
        <h3>{name}</h3>
        <p>{email}</p>
        <button className="private-key" onClick={onGetPrivateKey}>
            <p>🔑 Exportar chave privada</p>
        </button>
      </div>
      <div className="profile-info">
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;