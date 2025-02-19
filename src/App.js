import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ManageAdmin from "./pages/ManageAdmin";
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
