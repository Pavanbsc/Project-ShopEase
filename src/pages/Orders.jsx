import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBoxOpen, FaChevronRight, FaMoneyBillWave, FaReceipt, FaTruck, 
  FaCheck, FaClock, FaCalendarAlt, FaRupeeSign, FaShoppingBag,
  FaArrowRight, FaExclamationCircle, FaFilter, FaSearch
} from 'react-icons/fa';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { getLoggedInUser, getOrdersForUser } from '../services/api';
import '../styles/orders.css';

const formatCurrency = (paise) => `₹${(Number(paise || 0) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-');

const getStatusIcon = (status) => {
  switch (String(status || '').toLowerCase()) {
    case 'delivered':
      return <FaCheck />;
    case 'processing':
    case 'shipped':
      return <FaTruck />;
    case 'pending':
      return <FaClock />;
    default:
      return <FaShoppingBag />;
  }
};

function Orders() {
  const navigate = useNavigate();
  const [user] = useState(() => getLoggedInUser());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getOrdersForUser(user.id);
        setOrders(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate, user]);


  return (
    <div className="se-dashboard-page">
      <TopNavbar />
      <main className="se-main-content orders-main">
        <section className="se-home-section">
          {/* Header */}
          <div className="orders-header">
            <div className="header-content">
              <div>
                <h1 className="page-title">My Orders</h1>
                <p className="page-subtitle">Track and manage all your purchases</p>
              </div>
            </div>
          </div>

          {/* Controls */}

          {/* Loading */}
          {loading && (
            <div className="state-container loading-state">
              <div className="spinner"></div>
              <p>Loading your orders...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="state-container error-state">
              <div className="error-icon-box">
                <FaExclamationCircle />
              </div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="retry-button" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <div className="state-container empty-state">
              <div className="empty-icon">
                <FaBoxOpen />
              </div>
              <h2>No Orders Yet</h2>
              <p>Start shopping to place your first order</p>
              <button className="primary-button" onClick={() => navigate('/products')}>
                Continue Shopping
              </button>
            </div>
          )}

          {/* No Results */}

          {/* Orders Grid */}
            {!loading && !error && orders.length > 0 && (
            <div className="orders-grid">
              {orders.map((order) => (
                <article key={order.id} className={`order-item status-${String(order.status || '').toLowerCase()}`}>
                  {/* Top Section */}
                  <div className="order-top">
                    <div className="order-id-section">
                      <h3>Order ID: <span>#{order.id}</span></h3>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="status-wrapper">
                      <span className={`status-pill status-${String(order.status || '').toLowerCase()}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Middle Section - Items */}
                  <div className="order-items">
                    <div className="items-list">
                      {(order.items || []).slice(0, 2).map((item) => (
                        <div key={item.id} className="item-row">
                          <img 
                            src={item.imageUrl || 'https://via.placeholder.com/60x60'} 
                            alt={item.productName}
                            className="item-img"
                          />
                          <div className="item-info">
                            <p className="item-name">{item.productName}</p>
                            <p className="item-qty">Qty: {item.quantity}</p>
                          </div>
                          <p className="item-price">{formatCurrency(item.pricePaise)}</p>
                        </div>
                      ))}
                      {(order.items || []).length > 2 && (
                        <p className="more-items-text">+{order.items.length - 2} more items</p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="order-bottom">
                    <div className="payment-info">
                      <span className="label">Payment: </span>
                      <span className={`payment-method ${order.paymentMethod.toLowerCase()}`}>
                        {order.paymentMethod}
                        {order.paymentMethod === 'COD' && order.codPaymentStatus && (
                          <> ({order.codPaymentStatus})</>
                        )}
                      </span>
                    </div>
                    <div className="order-meta">
                      <div className="total-box">
                        <span className="total-label">Total</span>
                        <span className="total-price">{formatCurrency(order.totalAmountPaise)}</span>
                      </div>
                      <button className="view-btn" onClick={() => navigate(`/orders/${order.id}`)}>
                        <span>Track Order</span>
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Orders;
