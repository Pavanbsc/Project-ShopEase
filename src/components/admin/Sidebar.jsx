import { Link } from "react-router-dom";
import "../../styles/admin/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/products">Products</Link></li>
          <li><Link to="/admin/categories">Categories</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/inventory">Inventory</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
