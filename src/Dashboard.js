import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

// Ensure the API base URL is defined
const apiBaseUrl = process.env.REACT_APP_WEB_API_URL || "http://localhost:5000/";

const Dashboard = () => {
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("jwttoken"); // Also remove JWT for security
        localStorage.removeItem("isTOTPEnabled");

        navigate("/");
    };

    // Fetch User Count
    const fetchUserCount = async () => {
        try {

            const token = localStorage.getItem("jwttoken");
            if (!token) {
                console.error("No JWT token found, user might be unauthenticated.");
                return;
            }
            const response = await axios.get(`${apiBaseUrl}api/user/user-count`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("User count:", response.data);
            alert(`User count: ${response.data}`); // Show result in an alert
        } catch (error) {
            console.error("Error fetching user count:", error);
            alert("Failed to fetch user count.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h3>Welcome to the Dashboard</h3>

            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: "10px 20px",
                        margin: "10px",
                        cursor: "pointer",
                        backgroundColor: "#d9534f",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Logout
                </button>

                <button
                    onClick={fetchUserCount}
                    style={{
                        padding: "10px 20px",
                        margin: "10px",
                        cursor: "pointer",
                        backgroundColor: "#5bc0de",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Fetch User Count
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
