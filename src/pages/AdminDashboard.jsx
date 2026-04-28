import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="status-page">
      <div className="status-card">
        <h2>Admin logged in</h2>
        <p>You are logged in with ADMIN role.</p>
        <Link to="/login" className="status-link">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
