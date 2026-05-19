import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMinus, FaPlus, FaHeart, FaTrash, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { getCartItems, removeProductFromCart, updateCartItemQuantity, getLoggedInUser } from '../services/api';
import '../styles/cart-premium.css';

function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const user = getLoggedInUser();
        if (!user) {
          navigate('/login');
          return;
        }
        const cartItems = await getCartItems();
        setItems(cartItems);
      } catch (err) {
        toast.error('Failed to load cart');
        console.error('Error loading cart:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [navigate]);

  const calculations = useMemo(() => {
    const totalOriginal = items.reduce((acc, item) => acc + Number(item.originalPrice || item.price || 0) * Number(item.quantity || 0), 0);
    const totalCurrent = items.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0), 0);
    const discount = Math.max(totalOriginal - totalCurrent, 0);
    const total = totalCurrent;
    return { totalOriginal, totalCurrent, discount, total };
  }, [items]);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const next = await updateCartItemQuantity(productId, newQuantity);
      setItems(next);
    } catch (err) {
      toast.error('Failed to update quantity');
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const next = await removeProductFromCart(productId);
      setItems(next);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
      console.error('Error removing item:', err);
    }
  };

  const handleSaveForLater = (itemId) => {
    // TODO: Implement save for later functionality
    alert('Item saved for later!');
  };

  const discountPercent = (item) => {
    const orig = Number(item.originalPrice || item.price || 0);
    const current = Number(item.price || 0);
    if (orig <= current) return 0;
    return Math.round(((orig - current) / orig) * 100);
  };

  if (loading) {
    return (
      <div className="se-dashboard-page">
        <TopNavbar />
        <main className="se-main-content">
          <div className="se-loading">Loading cart...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="se-dashboard-page">
      <TopNavbar />
      <main className="se-main-content">
        <section className="se-home-section">
          <div className="se-cart-header">
            <h1>Shopping Cart</h1>
            <p>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>

          {!items.length ? (
            <div className="se-empty-cart">
              <div className="se-empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Start shopping from categories above and add items to your cart.</p>
            </div>
          ) : null}

          {items.length ? (
            <div className="se-cart-container">
              <div className="se-cart-items-section">
                {items.map((item) => (
                  <article key={item.id} className="se-cart-product-card">
                    {/* Product Image */}
                    <div className="se-cart-image-wrapper">
                      <img 
                        src={item.image || item.imageUrl || 'https://via.placeholder.com/160x160?text=Product'} 
                        alt={item.name || item.productName}
                        className="se-cart-product-image"
                      />
                      {discountPercent(item) > 0 && (
                        <div className="se-cart-discount-badge">
                          {discountPercent(item)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="se-cart-details-wrapper">
                      <div className="se-cart-product-info">
                        <p className="se-cart-brand">{item.brand || 'ShopEase Store'}</p>
                        <h3 className="se-cart-product-title">{item.name || item.productName}</h3>
                        
                        {/* Rating Row */}
                        <div className="se-cart-rating-row">
                          <div className="se-cart-rating-stars">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                size={14} 
                                color={i < 4 ? '#FFA500' : '#E0E0E0'}
                              />
                            ))}
                          </div>
                          <span className="se-cart-review-count">(2,345 reviews)</span>
                        </div>

                        {/* Price Section */}
                        <div className="se-cart-price-section">
                          <div className="se-cart-price-row">
                            <span className="se-cart-current-price">
                              ₹{Number(item.price || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </span>
                            {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                              <span className="se-cart-original-price">
                                ₹{Number(item.originalPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delivery & Stock Info */}
                        <div className="se-cart-delivery-info">
                          <div className="se-delivery-item">
                            <FaCheck size={12} />
                            <span>Free Delivery on this item</span>
                          </div>
                          <div className="se-delivery-item">
                            <FaCheck size={12} />
                            <span>In Stock • 12 available</span>
                          </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="se-cart-quantity-selector">
                          <button
                            className="se-qty-btn se-qty-minus"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <FaMinus size={12} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value || 1))}
                            className="se-qty-input"
                            readOnly
                          />
                          <button
                            className="se-qty-btn se-qty-plus"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="se-cart-actions">
                        <button
                          className="se-cart-action-btn se-save-later-btn"
                          onClick={() => handleSaveForLater(item.id)}
                          title="Save for later"
                        >
                          <FaHeart size={14} />
                          Save for Later
                        </button>
                        <button
                          className="se-cart-action-btn se-remove-btn"
                          onClick={() => handleRemoveItem(item.productId)}
                          title="Remove from cart"
                        >
                          <FaTrash size={14} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="se-cart-item-total">
                      <div className="se-item-total-label">Item Total</div>
                      <div className="se-item-total-price">
                        ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="se-item-quantity-info">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Price Summary Sidebar */}
              <aside className="se-cart-summary-panel">
                <div className="se-summary-header">
                  <h3>Price Details</h3>
                </div>

                <div className="se-summary-row">
                  <span>Price ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="se-summary-price-wrap">
                    <span className="se-summary-original-price">{formatCurrency(calculations.totalOriginal)}</span>
                  </span>
                </div>

                <div className="se-summary-row se-selling-row">
                  <span>Selling Price</span>
                  <span>{formatCurrency(calculations.totalCurrent)}</span>
                </div>

                {calculations.discount > 0 && (
                  <div className="se-summary-row se-discount-row">
                    <span>Discount</span>
                    <span className="se-discount-text">-{formatCurrency(calculations.discount)}</span>
                  </div>
                )}

                <div className="se-summary-row se-delivery-fee-row">
                  <span>Delivery Charges</span>
                  <span className="se-free-delivery">FREE</span>
                </div>

                {calculations.discount > 0 && (
                  <div className="se-summary-savings">
                    <FaCheck size={14} />
                    <span>You save {formatCurrency(calculations.discount)}</span>
                  </div>
                )}

                <div className="se-summary-divider"></div>

                <div className="se-summary-total">
                  <span>Total Amount</span>
                  <span className="se-total-price">
                    {formatCurrency(calculations.total)}
                  </span>
                </div>

                <button className="se-checkout-btn" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </button>

                <div className="se-summary-guarantee">
                  <p>Safe and Secure payments. 100% Authentic products.</p>
                </div>
              </aside>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
