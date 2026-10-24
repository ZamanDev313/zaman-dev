
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../../Components/Dashboard/AdminSidebar";
import AdminHeader from "../../Components/Dashboard/AdminHeader";
import { AdminToastProvider } from "./AdminToast";
import "../../styles/Dashboard/Admin.css";

function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((previous) => !previous);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((previous) => !previous);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <AdminToastProvider>
      <div
        className={`admin-layout${
          sidebarCollapsed ? " sidebar-collapsed" : ""
        }`}
      >
        {mobileSidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-overlay"
            aria-label="Close navigation menu"
            onClick={closeMobileSidebar}
          />
        )}

        <AdminSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onNavigate={closeMobileSidebar}
        />

        <div className="admin-main">
          <AdminHeader
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={toggleSidebar}
            onToggleMobileSidebar={toggleMobileSidebar}
          />

          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminToastProvider>
  );
}

export default AdminLayout;
