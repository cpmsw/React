import React from "react";
import { getAccessLevel } from "./utils/authUtils";

const ManageAdmin = () => {
  const accessLevel = getAccessLevel("Manage Admin");

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
      <button disabled={accessLevel < 2}>Edit</button>

    </div>
  );
};

export default ManageAdmin;
