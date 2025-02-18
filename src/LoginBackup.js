import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate(); // Use navigate instead of window.location.href
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [totpCode, setTotpCode] = useState("");
    const [step, setStep] = useState(1); // Step 1: Login, Step 2: TOTP
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        try {
            const response = await axios.post(`${process.env.REACT_APP_WEB_API_URL}api/user/validate`, { email, password });
            const userData = response.data;
            setUser(userData);

            if (userData.isTOTPEnabled) {
                setStep(2);
            } else {
                localStorage.setItem("isAuthenticated", "true");
                navigate("/dashboard"); // Navigate instead of window.location.href
            }
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    const handleVerifyTOTP = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError("");
        try {
            const response = await axios.post(`${process.env.REACT_APP_WEB_API_URL}api/user/verify-totp`, {
                recid: user.recid,
                totpCode,
            });

            if (response.data.success) {
                localStorage.setItem("isAuthenticated", "true");
                navigate("/dashboard"); // Navigate instead of window.location.href
            } else {
                setError("Invalid TOTP Code");
            }
        } catch (err) {
            setError("Invalid TOTP Code");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "5px", width: "300px", textAlign: "center" }}>
                {step === 1 ? (
                    <>
                        <h2>Login</h2>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                        <button onClick={handleLogin} style={buttonStyle}>Login</button>
                    </>
                ) : (
                    <>
                        <h2>Enter TOTP Code</h2>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <form onSubmit={handleVerifyTOTP}>
                            <input
                                type="text"
                                placeholder="TOTP Code"
                                value={totpCode}
                                onChange={(e) => setTotpCode(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleVerifyTOTP(e)} // Handle Enter key
                                autoFocus
                                style={inputStyle}
                            />
                            <button type="submit" style={buttonStyle}>Verify</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  border: "1px solid #ddd",
  borderRadius: "5px"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "blue",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Login;
