import Sidebar from "../../components/admin/Sidebar";
import TopNavbar from "../../components/admin/TopNavbar";
import { Outlet } from "react-router-dom";
import "../../styles/admin/layout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <TopNavbar />
        <Outlet />
      </div>
    </div>
  );
}
