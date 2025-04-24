import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [formdata, setFormdata] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", formdata);
            console.log("Response from login:", response.data);

            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("userName", user.name); // Store name for navbar

            navigate("/profile"); // Navigate to profile
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid credentials. Please try again.");
        }
    };


    return (
        <div className="w-50 m-auto mt-5">
            <h1 className="mb-4">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" value={formdata.email} onChange={handleChange} className="form-control" placeholder="Enter your email"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={formdata.password} onChange={handleChange} className="form-control" placeholder="Enter your password"
                    />
                </div>
                {error && <div className="text-danger mb-3">{error}</div>}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <div className="mt-3">
                <Link to="/">Don't have an account? Signup here</Link>
            </div>
        </div>
    );
}

export default Login;
