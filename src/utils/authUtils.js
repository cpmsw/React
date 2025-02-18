import { jwtDecode } from "jwt-decode";

export const getAccessLevel = (accessKey) => {
  const token = localStorage.getItem("jwttoken");
  if (!token) return 0; // Default to "Access Denied"

  try {
    const decoded = jwtDecode(token);
    return parseInt(decoded[`Access:${accessKey}`] || "0", 10);
  } catch (error) {
    console.error("Error decoding token:", error);
    return 0;
  }
};
