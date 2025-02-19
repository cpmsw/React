import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Login/Dashboard";
import ManageAdmin from "./pages/Admin/ManageAdmin";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manageadmin" element={<ManageAdmin />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
