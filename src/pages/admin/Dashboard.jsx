import { Link } from "react-router-dom";

const links = [
  { label: 'Products', to: '/admin/products', description: 'Manage all products and inventory details.' },
  { label: 'Categories', to: '/admin/categories', description: 'Update categories and organize products.' },
  { label: 'Orders', to: '/admin/orders', description: 'View and process customer orders.' },
  { label: 'Users', to: '/admin/users', description: 'Manage registered customers and admins.' },
  { label: 'Inventory', to: '/admin/inventory', description: 'Track stock levels and inventory status.' },
];

export default function Dashboard() {
  return (
    <div className="admin-dashboard-page">
      <section className="admin-dashboard-hero">
        <h2>Admin Dashboard</h2>
        <p>Choose an admin section below to manage your store.</p>
      </section>

      <section className="admin-dashboard-grid">
        {links.map((item) => (
          <Link key={item.to} to={item.to} className="admin-dashboard-card">
            <h3>{item.label}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
