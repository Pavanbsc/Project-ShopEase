import { Link, useNavigate } from 'react-router-dom';
import '../styles/admin.css';

function AdminDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    // placeholder: clear auth (to be implemented)
    navigate('/login');
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li><Link to="/admin-products">Products</Link></li>
            <li><Link to="/admin-categories">Categories</Link></li>
            <li><Link to="/admin-orders">Orders</Link></li>
            <li><Link to="/admin-users">Users</Link></li>
            <li><Link to="/admin-inventory">Inventory</Link></li>
          </ul>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="brand">ShopEase Admin</div>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </header>

        <section className="admin-container">
          <h1>Admin Dashboard</h1>
          <p className="lead">Choose an admin section below to manage your store.</p>

          <div className="cards-grid">
            <Link to="/admin-products" className="card">
              <h3>Products</h3>
              <p>Manage all products and inventory details.</p>
            </Link>

            <Link to="/admin-categories" className="card">
              <h3>Categories</h3>
              <p>Update categories and organize products.</p>
            </Link>

            <Link to="/admin-orders" className="card">
              <h3>Orders</h3>
              <p>View and process customer orders.</p>
            </Link>

            <Link to="/admin-users" className="card">
              <h3>Users</h3>
              <p>Manage registered customers and admins.</p>
            </Link>

            <Link to="/admin-inventory" className="card card-large">
              <h3>Inventory</h3>
              <p>Track stock levels and inventory status.</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
