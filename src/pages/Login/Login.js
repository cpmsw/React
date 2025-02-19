import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Login.css';
import React, { useState, useEffect, useRef } from 'react';

// Add the API base URL
const apiBaseUrl = process.env.REACT_APP_WEB_API_URL;

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: Login, Step 2: TOTP
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  //const [totpSecret, setTotpSecret] = useState(''); // Assuming you have a totpSecret state
  const [showQRCode, setShowQRCode] = useState(false); // Track QR code visibility
  const totpInputRef = useRef(null); // Reference for TOTP input field

  useEffect(() => {
    if (step === 3 && totpInputRef.current) {
      totpInputRef.current.focus(); // Focus the TOTP input field when step 2 is reached
    }
  }, [step]); // Run when step changes
  // useEffect(() => {
  //   if (user?.totpSecret) {
  //     setTotpSecret(user.totpSecret); // Set the totpSecret from the user data
  //   }
  // }, [user]);


  const handleLogin = async () => {
    setError('');
    try {
      const response = await axios.post(`${apiBaseUrl}api/user/validate`, {
        email,
        password,
      });
      const userData = response.data;
      setUser(userData);
      //console.log(userData);
      if (userData.isTOTPEnabled) {
        if (userData.totpSecret === null) {
          setStep(2); // Step 2: TOTP setup (QR Code generation)
          setupTOTP(); // Generate the QR code for TOTP setup
        } else {
          setStep(3); // Step 3: Enter TOTP code
        }
      } else {
      if (userData.token) {
        // Store token in localStorage
        localStorage.setItem("jwttoken", userData.token);
        localStorage.setItem("isTOTPEnabled", userData.isTOTPEnabled);
      }

        navigate('/dashboard'); // Navigate to home if TOTP is not enabled
      }
    } catch (error) {
      if (error.response) {
        // API responded with an error (e.g., invalid credentials)
        setError("Invalid email or password");
      } else if (error.request) {
        // No response received (API might be down)
        setError("Unable to connect to the server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    };
    return (
      <div>
        <button onClick={handleLogin}>Login</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  };

  const setupTOTP = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}api/user/setup-totp`, {
        email
      });

      const qrCode = response.data; // Retrieve the QR code from the response
      console.log(qrCode);
      setQrCode(qrCode); // Set the QR code to be displayed
    } catch (err) {
      console.error('Error setting up TOTP:', err);
      setError('There was an error setting up TOTP.');
    }
  };

  const handleVerifyTOTP = async () => {
    setError('');
    try {
      const response = await axios.post(`${apiBaseUrl}api/user/verify-totp`, {
        recid: user.recid,
        totpCode,
      });
      //console.log(user);
      if (response.data.success) {
        if (user.token) {
          // Store token in localStorage
          localStorage.setItem("jwttoken", user.token);
          localStorage.setItem("isTOTPEnabled", user.isTOTPEnabled);
          //localStorage.setItem("totpSecret", user.totpSecret);
          //console.log(user);
        }
        navigate('/dashboard'); // Use navigate for redirect
      } else {
        setError('Invalid TOTP Code');
      }
    } catch (err) {
      setError('Invalid TOTP Code');
    }
  };

  const generateQRCode = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}api/user/resend-qrcode`, {
        params: { email: email },
      });
      setQrCode(response.data); // Set the QR code for display
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const handleQRCodeClick = (e) => {
    e.preventDefault();
    generateQRCode(); // Trigger QR code generation
    setShowQRCode(true); // Show the QR code after clicking the link
    // Set focus back to the TOTP input field after QR code generation
    totpInputRef.current.focus();
  };



  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', width: '300px', textAlign: 'center' }}>
        {step === 1 ? (
          <>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleLogin} style={buttonStyle}>
              Login
            </button>
          </>
        ) : step === 2 ? (
          <>
            <h2>Set up TOTP</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Scan the QR code below with your Google Authenticator app.</p>
            {qrCode && (
              <div>
                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" style={{ width: '150px', height: '150px' }} />
              </div>
            )}
            <button onClick={() => setStep(3)} style={buttonStyle}>Proceed to TOTP Verification</button>
          </>

        ) : step === 3 ? (
          <>
            <h2>Enter TOTP Code</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
              type="text"
              placeholder="TOTP Code"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleVerifyTOTP(); // Trigger TOTP verification on Enter
                }
              }}
              style={inputStyle}
              ref={totpInputRef} // Set the reference here
            />
            <button onClick={handleVerifyTOTP} style={buttonStyle}>
              Verify
            </button>

            <div style={{ marginTop: '10px' }}>
              <p>
                Need to rescan the QR code?{' '}
                <a
                  href="#displayQRCode"
                  onClick={handleQRCodeClick} // Handle the click to generate and show the QR code
                  style={{ color: 'blue', textDecoration: 'underline' }}

                >
                  QRCode
                </a>
              </p>
              {/* Show QR code only if it's generated */}
              {showQRCode && qrCode && (
                <div>
                  <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" style={{ width: '150px', height: '150px' }} />
                  <p>Scan this QR code with your Google Authenticator app.</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  border: '1px solid #ddd',
  borderRadius: '5px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  background: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default Login;
