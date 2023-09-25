// src/routes.tsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
// TODO: Setup routes to allow for dynamic accounts routing based on accounts added by the user
const Routers: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} /> {/* Creates a route for the root path to lead to dashboards (IE index is dashboard component) */}
      <Route path="/accounts" element={<Accounts />} /> {/* Creates a route for accounts */}
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default Routers;
