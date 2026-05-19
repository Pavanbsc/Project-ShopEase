import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, FaCheckCircle, FaClock, FaMoneyBillWave, FaTruck,
  FaBox, FaShippingFast, FaHome, FaMapMarkerAlt
} from 'react-icons/fa';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { getLoggedInUser, getOrderById } from '../services/api';
import '../styles/orders.css';

const TRACK_STEPS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const labels = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const step_icons = {
  PLACED: <FaBox />,
  CONFIRMED: <FaCheckCircle />,
  PACKED: <FaBox />,
  SHIPPED: <FaTruck />,
  OUT_FOR_DELIVERY: <FaShippingFast />,
  DELIVERED: <FaHome />,
};

const formatCurrency = (paise) => `₹${(Number(paise || 0) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-');

function TrackOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [user] = useState(() => getLoggedInUser());
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getOrderById(orderId);
        if (user.role !== 'ADMIN' && Number(data.userId) !== Number(user.id)) {
          setError('You are not allowed to view this order.');
          setOrder(null);
        } else {
          setOrder(data);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, orderId, user]);

  const activeStep = useMemo(() => {
    if (!order?.status) return 0;
    const idx = TRACK_STEPS.indexOf(order.status);
    return idx >= 0 ? idx : 0;
  }, [order?.status]);

  const progressPercentage = ((activeStep + 1) / TRACK_STEPS.length) * 100;

  return (
    <div className="se-dashboard-page">
      <TopNavbar />
      <main className="se-main-content track-main">
        <section className="se-home-section">
          {/* Back Button */}
          <button type="button" className="back-button" onClick={() => navigate('/orders')}>
            <FaArrowLeft /> Back to Orders
          </button>

          {/* Loading */}
          {loading && (
            <div className="state-container loading-state">
              <div className="spinner"></div>
              <p>Loading order details...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="state-container error-state">
              <div className="error-icon-box">
                <FaTruck />
              </div>
              <h3>Unable to Load Order</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Order Details */}
          {!loading && !error && order && (
            <>
              {/* Header Card */}
              <div className="track-header-card">
                <div className="header-top">
                  <div className="header-title">
                    <h1>Order #{order.id}</h1>
                    <p className="order-date-text">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className={`status-badge-large status-${String(order.status || '').toLowerCase()}`}>
                    <span className="status-icon">{step_icons[order.status] || <FaTruck />}</span>
                    <span>{labels[order.status] || order.status}</span>
                  </div>
                </div>

                <div className="header-info-grid">
                  <div className="info-card">
                    <span className="info-icon">₹</span>
                    <div>
                      <p className="info-label">Total Amount</p>
                      <p className="info-value">{formatCurrency(order.totalAmountPaise)}</p>
                    </div>
                  </div>
                  <div className="info-card">
                    <span className="info-icon">💳</span>
                    <div>
                      <p className="info-label">Payment Method</p>
                      <p className="info-value">{order.paymentMethod}</p>
                    </div>
                  </div>
                  {order.paymentMethod === 'COD' && (
                    <div className="info-card">
                      <span className="info-icon">📦</span>
                      <div>
                        <p className="info-label">Payment Status</p>
                        <p className={`info-value cod-${String(order.codPaymentStatus || '').toLowerCase()}`}>
                          {order.codPaymentStatus}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-container">
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <p className="progress-text">{Math.round(progressPercentage)}% Complete</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="timeline-section">
                <h2 className="timeline-title">Delivery Timeline</h2>
                <div className="timeline-container">
                  {TRACK_STEPS.map((step, index) => {
                    const done = index <= activeStep && order.status !== 'CANCELLED';
                    const isCurrent = index === activeStep && order.status !== 'CANCELLED';
                    return (
                      <div key={step} className={`timeline-item ${done ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                        <div className={`timeline-marker ${done ? 'done' : ''} ${isCurrent ? 'active' : ''}`}>
                          {done ? <FaCheckCircle /> : (isCurrent ? <FaClock /> : <div className="pending-dot"></div>)}
                        </div>
                        <div className="timeline-content">
                          <h4 className="timeline-label">{labels[step]}</h4>
                          <p className="timeline-status">{done ? '✓ Completed' : (isCurrent ? 'In Progress' : 'Pending')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Section */}
              <div className="order-items-section">
                <h2 className="section-title">Order Items</h2>
                <div className="items-container">
                  {(order.items || []).map((item) => (
                    <div className="item-card" key={item.id}>
                      <div className="item-image">
                        <img 
                          src={item.imageUrl || 'https://via.placeholder.com/100x100'} 
                          alt={item.productName}
                        />
                      </div>
                      <div className="item-content">
                        <h3 className="item-title">{item.productName}</h3>
                        <div className="item-details-grid">
                          <div className="detail">
                            <span className="detail-label">Quantity</span>
                            <span className="detail-value">{item.quantity}</span>
                          </div>
                          <div className="detail">
                            <span className="detail-label">Price</span>
                            <span className="detail-value">{formatCurrency(item.pricePaise)}</span>
                          </div>
                          <div className="detail">
                            <span className="detail-label">Total</span>
                            <span className="detail-value total">{formatCurrency(item.pricePaise * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.totalAmountPaise)}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span>{formatCurrency(order.totalAmountPaise)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default TrackOrder;
