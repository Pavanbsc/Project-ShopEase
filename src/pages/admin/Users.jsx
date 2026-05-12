import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers } from '../../services/api';

const formatDate = (value) => {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-IN');
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await getAllUsers();

        if (isMounted) {
          setUsers(data);
        }
      } catch (apiError) {
        const message = apiError?.response?.data?.message || 'Unable to load users.';
        if (isMounted) {
          setError(message);
        }
        toast.error(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const totals = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role === 'ADMIN').length,
    customers: users.filter((user) => user.role !== 'ADMIN').length,
  }), [users]);

  return (
    <div className="admin-users-page">
      <div className="admin-products-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Users Management</h2>
          <p>Registered users and admins are loaded from the auth database in real time.</p>
        </div>
      </div>

      <div
        className="inventory-summary"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="inventory-summary-card">
          <p>Total Users</p>
          <strong>{totals.total}</strong>
        </div>
        <div className="inventory-summary-card">
          <p>Customers</p>
          <strong>{totals.customers}</strong>
        </div>
        <div className="inventory-summary-card">
          <p>Admins</p>
          <strong>{totals.admins}</strong>
        </div>
      </div>

      {isLoading ? <div className="loading-state">Loading users...</div> : null}
      {!isLoading && error ? <div className="empty-state">{error}</div> : null}
      {!isLoading && !error && !users.length ? (
        <div className="empty-state">No users registered yet.</div>
      ) : null}

      {!isLoading && !error && users.length ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Name</th>
                <th align="left">Email</th>
                <th align="left">Role</th>
                <th align="left">Created</th>
                <th align="left">Updated</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className="stock-pill in-stock"
                      style={{ background: user.role === 'ADMIN' ? '#dbeafe' : '#dcf7ea', color: user.role === 'ADMIN' ? '#1d4ed8' : '#17794b' }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
