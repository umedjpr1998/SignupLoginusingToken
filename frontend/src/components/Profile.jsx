import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const userName = localStorage.getItem("userName");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">MyApp</a>
                    <div className="d-flex ms-auto align-items-center">
                        <span className="navbar-text text-white me-3">
                            Welcome, {userName}!
                        </span>
                        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Profile Content */}
            <div className="container mt-5">
                <h2>This Is Profile Page</h2>
            </div>
        </>
    );
};

export default Profile;
