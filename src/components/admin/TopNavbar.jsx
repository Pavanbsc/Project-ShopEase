import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../services/api";
import "../../styles/admin/topnavbar.css";

export default function TopNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
    logout();
    navigate('/login');
  };

  return (
    <header className="top-navbar">
      <div className="top-navbar-title">
        <h1>ShopEase Admin</h1>
        {user?.name ? <p>Welcome, {user.name}</p> : null}
      </div>
      <div className="top-navbar-actions">
        <button type="button" className="admin-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
