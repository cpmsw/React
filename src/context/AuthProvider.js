import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessLevels, setAccessLevels] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("jwttoken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const extractedAccess = Object.keys(decoded)
          .filter((key) => key.startsWith("Access:"))
          .reduce((acc, key) => {
            acc[key.replace("Access:", "")] = parseInt(decoded[key], 10);
            // console.log(acc);
            return acc;
          }, {});
        setAccessLevels(extractedAccess);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessLevels }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
