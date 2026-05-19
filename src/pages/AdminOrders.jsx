import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllOrders, getLoggedInUser, updateOrderStatus } from '../services/api';
import '../styles/admin.css';
import '../styles/orders.css';

const STATUS_OPTIONS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const formatCurrency = (paise) => `₹${(Number(paise || 0) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'ADMIN') {
      navigate('/home', { replace: true });
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders();
        const sorted = [...data].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
        setOrders(sorted);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const handleStatusChange = (orderId, status) => {
    setOrders((prev) => prev.map((order) => (Number(order.id) === Number(orderId) ? { ...order, status } : order)));
  };

  const handleSaveStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((order) => (Number(order.id) === Number(orderId) ? updated : order)));
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li><Link to="/admin-dashboard">Dashboard</Link></li>
            <li><Link to="/admin-products">Products</Link></li>
            <li className="active"><Link to="/admin-orders">Orders</Link></li>
            <li><Link to="/admin-users">Users</Link></li>
            <li><Link to="/admin-inventory">Inventory</Link></li>
          </ul>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="brand">ShopEase Admin</div>
          <button className="btn-logout" onClick={() => navigate('/admin-dashboard')}>Back</button>
        </header>

        <section className="admin-container">
          <h1>Order Management</h1>
          <p className="lead">Update shipment status and COD payment progression from one dashboard.</p>

          <div className="users-panel">
            {loading ? <div>Loading orders...</div> : null}

            {!loading && !orders.length ? <div>No orders found.</div> : null}

            {!loading && orders.length ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>COD Status</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id}</strong>
                        <div className="orders-table-sub">{new Date(order.createdAt).toLocaleString('en-IN')}</div>
                      </td>
                      <td>{order.name || `User ${order.userId}`}</td>
                      <td>{formatCurrency(order.totalAmountPaise)}</td>
                      <td>{order.paymentMethod}</td>
                      <td>{order.codPaymentStatus || '-'}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="order-status-select"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="se-primary-button"
                          onClick={() => handleSaveStatus(order.id, order.status)}
                          disabled={updatingId === order.id}
                        >
                          {updatingId === order.id ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminOrders;
