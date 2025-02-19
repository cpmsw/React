import React from "react";
import { useAuth } from "../context/AuthProvider";

const ManageAdmin = () => {
   const { accessLevels } = useAuth();
  // console.log("Access Levels:", accessLevels);
  // console.log("Access Level for ABC:", accessLevels["ABC"]);
  // console.log("Access Level for Manage Admin:", accessLevels["Manage Admin"]);


  const accessLevel = accessLevels["Manage Admin"] || 0;

  const getMessage = () => {
    switch (accessLevel) {
      case 0:
        return "Access Denied";
      case 1:
        return "Read-only access";
      case 2:
        return "Read/Write access";
      default:
        return "Invalid Access";
    }
  };

  return (
    <div>
      <h1>Manage Admin</h1>
      <p>{getMessage()}</p>
    </div>
  );
};

export default ManageAdmin;
