import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCheckCircle,
  FaChevronRight,
  FaClock,
  FaCreditCard,
  FaHome,
  FaLock,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaPhone,
  FaPlus,
  FaMobileAlt,
  FaShieldAlt,
  FaTruck,
  FaWallet,
  FaUser,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import {
  clearCart,
  createOrder,
  createPaymentOrder,
  reportPaymentFailure,
  getCartItems,
  getLoggedInUser,
  getUserProfile,
  verifyPaymentOrder,
  updateUserProfile,
} from '../services/api';
import '../styles/checkout-redesign.css';

const emptyAddress = {
  street: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
  alternatePhone: '',
  landmark: '',
};

const currency = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

function Checkout() {
  const navigate = useNavigate();
  const [user] = useState(() => getLoggedInUser());
  const [cartItems, setCartItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const paymentOptions = [
    {
      id: 'RAZORPAY',
      title: 'Pay online with Razorpay',
      subtitle: 'UPI, Cards, Net Banking, EMI',
      badge: 'Recommended',
      tone: 'online',
      icon: FaCreditCard,
      description: 'Fast, secure online payment with instant confirmation and transaction safety.',
      highlights: ['UPI QR', 'Cards', 'Net banking', 'EMI'],
    },
    {
      id: 'COD',
      title: 'Cash on Delivery',
      subtitle: 'Pay when the package arrives',
      badge: 'No advance payment',
      tone: 'cod',
      icon: FaMoneyBillWave,
      description: 'Place the order now and pay in cash at delivery for a simple offline checkout.',
      highlights: ['No online payment', 'Easy for first-time buyers', 'Pay at doorstep'],
    },
  ];

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const loadCheckoutData = async () => {
      setLoading(true);
      try {
        const [profileData, storedCart] = await Promise.all([
          getUserProfile(user.id),
          getCartItems(),
        ]);

        const nextAddresses = Array.isArray(profileData?.addresses) ? profileData.addresses : [];
        setProfile(profileData);
        setAddresses(nextAddresses);
        setCartItems(storedCart);

        const storageKey = `shopease_checkout_address_${user.id}`;
        const storedSelection = window.localStorage.getItem(storageKey);
        const fallbackSelection = nextAddresses[0]?.id || null;
        setSelectedAddressId(storedSelection || fallbackSelection);
      } catch (error) {
        setProfile(null);
        setAddresses([]);
        setCartItems([]);
        setMessage(error?.response?.data?.message || 'Unable to load checkout details right now.');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [navigate, user]);

  useEffect(() => {
    if (!user || !selectedAddressId) return;
    window.localStorage.setItem(`shopease_checkout_address_${user.id}`, String(selectedAddressId));
  }, [selectedAddressId, user]);

  const totals = useMemo(() => {
    const totalOriginal = cartItems.reduce(
      (acc, item) => acc + Number(item.originalPrice || item.price || 0) * Number(item.quantity || 0),
      0
    );
    const totalCurrent = cartItems.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    const discount = Math.max(totalOriginal - totalCurrent, 0);
    return {
      original: totalOriginal,
      current: totalCurrent,
      discount,
      delivery: 0,
      payable: totalCurrent,
    };
  }, [cartItems]);

  const selectedAddress = addresses.find((address) => String(address.id) === String(selectedAddressId));
  const handleOpenPaymentModal = () => {
    if (!cartItems.length || !selectedAddressId) return;
    setMessage('');
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    if (placingOrder) return;
    setShowPaymentModal(false);
  };

  const handleConfirmOrder = async () => {
    if (!cartItems.length || !selectedAddressId) return;

    setMessage('');
    setPlacingOrder(true);
    try {
      const buildOrderPayload = () => ({
        userId: user.id,
        name: profile?.name || user?.name || 'Customer',
        phone: selectedAddress?.phone || profile?.phone || '',
        addressLine1: selectedAddress?.street || '',
        addressLine2: selectedAddress?.landmark || selectedAddress?.alternatePhone || '',
        city: selectedAddress?.city || '',
        state: selectedAddress?.state || '',
        postalCode: selectedAddress?.pincode || '',
        country: 'India',
        totalAmountPaise: Math.round(Number(totals.payable || 0) * 100),
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: Number(item.productId || item.id || 0),
          productName: item.productName || item.name || 'Product',
          imageUrl: item.imageUrl || item.image || '',
          pricePaise: Math.round(Number(item.price || 0) * 100),
          quantity: Math.max(1, Number(item.quantity || 1)),
        })),
      });

      if (paymentMethod === 'COD') {
        await createOrder(buildOrderPayload());
        await clearCart();
        toast.success('Cash on Delivery selected. Your order will be collected on delivery.');
        setMessage('Order placed successfully with Cash on Delivery.');
        setShowPaymentModal(false);
        navigate('/orders');
        return;
      }

      const paymentOrder = await createPaymentOrder({
        userId: user.id,
        purpose: 'CART',
        referenceType: 'ORDER',
        referenceId: `CART_${user.id}_${Date.now()}`,
        amountPaise: Math.round(totals.payable * 100),
        metadata: {
          paymentMethod: 'RAZORPAY',
          itemsCount: String(cartItems.length),
          addressId: String(selectedAddressId),
          address: selectedAddress?.street || '',
          city: selectedAddress?.city || '',
          pincode: selectedAddress?.pincode || '',
        },
      });

      const isScriptReady = await loadRazorpayScript();
      if (!isScriptReady) {
        throw new Error('Unable to load Razorpay checkout. Please try again.');
      }

      const razorpay = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amountPaise,
        currency: paymentOrder.currency,
        name: 'ShopEase Premium Checkout',
        description: paymentOrder.description,
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: profile?.name || user?.name || '',
          email: profile?.email || user?.email || '',
          contact: profile?.phone || selectedAddress?.phone || '',
        },
        notes: {
          paymentTransactionId: paymentOrder.paymentTransactionId,
          purpose: paymentOrder.purpose,
          referenceType: paymentOrder.referenceType,
          referenceId: paymentOrder.referenceId,
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: async () => {
            try {
              await reportPaymentFailure({
                paymentTransactionId: paymentOrder.paymentTransactionId,
                razorpayOrderId: paymentOrder.razorpayOrderId,
                errorReason: 'Checkout closed by the user',
                errorSource: 'checkout',
                errorStep: 'dismissed',
              });
            } catch {
              // ignore tracking errors
            }
            toast.info('Payment was cancelled.');
          },
        },
        handler: async (response) => {
          try {
            const verification = await verifyPaymentOrder({
              paymentTransactionId: paymentOrder.paymentTransactionId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            await createOrder(buildOrderPayload());
            await clearCart();

            toast.success(verification?.message || 'Payment completed successfully');
            setMessage('Payment completed successfully. Your order has been placed.');
            navigate('/orders');
          } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Payment verification failed';
            toast.error(errorMessage);
            setMessage(errorMessage);
          }
        },
      });

      razorpay.on('payment.failed', async (response) => {
        try {
          await reportPaymentFailure({
            paymentTransactionId: paymentOrder.paymentTransactionId,
            razorpayOrderId: response?.error?.metadata?.order_id || paymentOrder.razorpayOrderId,
            errorCode: response?.error?.code,
            errorReason: response?.error?.reason,
            errorSource: response?.error?.source,
            errorStep: response?.error?.step,
          });
        } catch {
          // ignore failure tracking errors
        }

        const errorMessage = response?.error?.description || response?.error?.reason || 'Payment failed';
        toast.error(errorMessage);
        setMessage(errorMessage);
      });

      razorpay.open();

      // Close our modal only after the Razorpay checkout has been handed off.
      setShowPaymentModal(false);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setMessage('');
  };

  const handleSaveNewAddress = async () => {
    if (!user?.id) return;

    const requiredFields = ['street', 'city', 'state', 'pincode', 'phone'];
    const hasMissing = requiredFields.some((field) => !String(newAddress[field] || '').trim());
    if (hasMissing) {
      setMessage('Please fill in the required address details before continuing.');
      return;
    }

    if (!/^[0-9]{6}$/.test(newAddress.pincode)) {
      setMessage('Enter a valid 6-digit pincode.');
      return;
    }

    if (!/^[0-9]{10}$/.test(newAddress.phone)) {
      setMessage('Enter a valid 10-digit mobile number.');
      return;
    }

    setSavingAddress(true);
    setMessage('');
    try {
      const nextAddresses = [...addresses, { ...newAddress, id: Date.now() }];
      const saved = await updateUserProfile(user.id, {
        name: profile?.name,
        phone: profile?.phone,
        dateOfBirth: profile?.dateOfBirth,
        gender: profile?.gender,
        address: profile?.address,
        addresses: nextAddresses,
      });

      const finalAddresses = Array.isArray(saved?.addresses) ? saved.addresses : nextAddresses;
      setAddresses(finalAddresses);
      setSelectedAddressId(finalAddresses[finalAddresses.length - 1]?.id || null);
      setNewAddress(emptyAddress);
      setShowAddressForm(false);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to save the new delivery address.');
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <div className="se-checkout-page">
      <TopNavbar />

      <main className="se-checkout-main">
        <div className="se-checkout-hero">
          <div className="se-checkout-hero-copy">
            <span className="se-checkout-badge">
              <FaLock /> Secure checkout
            </span>
            <h1>Delivery, products and order summary</h1>
            <p>
              Choose a delivery address, review your cart items and confirm your order with a clean, guided flow.
            </p>
          </div>

          <div className="se-checkout-steps" aria-label="Checkout progress">
            <div className="se-step se-step-active">
              <span>1</span>
              Address
            </div>
            <FaChevronRight />
            <div className="se-step se-step-active">
              <span>2</span>
              Review
            </div>
            <FaChevronRight />
            <div className="se-step">
              <span>3</span>
              Pay
            </div>
          </div>
        </div>

        {message ? <div className="se-checkout-alert">{message}</div> : null}

        <div className="se-checkout-grid">
          <section className="se-checkout-panel se-delivery-panel">
            <div className="se-panel-header">
              <div>
                <span className="se-panel-eyebrow">Deliver to</span>
                <h2>
                  <FaMapMarkerAlt /> Select your delivery address
                </h2>
              </div>
              <button className="se-inline-action" onClick={() => setShowAddressForm((prev) => !prev)}>
                <FaPlus /> {showAddressForm ? 'Close form' : 'Add new address'}
              </button>
            </div>

            {showAddressForm ? (
              <div className="se-address-form-card">
                <div className="se-address-form-grid">
                  <label className="se-input-group se-full-width">
                    <span>
                      <FaHome /> Street Address
                    </span>
                    <input name="street" value={newAddress.street} onChange={handleAddressChange} placeholder="House / street / apartment" />
                  </label>
                  <label className="se-input-group">
                    <span>City</span>
                    <input name="city" value={newAddress.city} onChange={handleAddressChange} placeholder="City" />
                  </label>
                  <label className="se-input-group">
                    <span>State</span>
                    <input name="state" value={newAddress.state} onChange={handleAddressChange} placeholder="State" />
                  </label>
                  <label className="se-input-group">
                    <span>Pincode</span>
                    <input name="pincode" value={newAddress.pincode} onChange={handleAddressChange} placeholder="6-digit pincode" />
                  </label>
                  <label className="se-input-group">
                    <span>
                      <FaPhone /> Mobile No.
                    </span>
                    <input name="phone" value={newAddress.phone} onChange={handleAddressChange} placeholder="Primary mobile number" />
                  </label>
                  <label className="se-input-group">
                    <span>
                      <FaPhone /> Alternate Mobile No.
                    </span>
                    <input name="alternatePhone" value={newAddress.alternatePhone} onChange={handleAddressChange} placeholder="Optional alternate number" />
                  </label>
                  <label className="se-input-group se-full-width">
                    <span>
                      <FaMapMarkerAlt /> Landmark
                    </span>
                    <input name="landmark" value={newAddress.landmark} onChange={handleAddressChange} placeholder="Nearby landmark (optional)" />
                  </label>
                </div>

                <div className="se-address-form-actions">
                  <button className="se-primary-button" onClick={handleSaveNewAddress} disabled={savingAddress}>
                    <FaCheckCircle /> {savingAddress ? 'Saving...' : 'Save & use this address'}
                  </button>
                  <button className="se-secondary-button" onClick={() => setShowAddressForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}

            <div className="se-address-list-wrap">
              {loading ? (
                <div className="se-loading-state">Loading saved addresses...</div>
              ) : addresses.length ? (
                addresses.map((address) => {
                  const active = String(address.id) === String(selectedAddressId);
                  return (
                    <label key={address.id} className={`se-address-card ${active ? 'is-active' : ''}`}>
                      <input
                        type="radio"
                        name="deliveryAddress"
                        checked={active}
                        onChange={() => handleSelectAddress(address.id)}
                      />

                      <div className="se-address-card-body">
                        <div className="se-address-card-title-row">
                          <div>
                            <strong>
                              <FaUser /> {profile?.name || 'Saved address'}
                            </strong>
                            <span>{active ? 'Selected for delivery' : 'Tap to deliver here'}</span>
                          </div>
                          {active ? <span className="se-selected-pill"><FaCheckCircle /> Selected</span> : null}
                        </div>

                        <p className="se-address-line se-address-main-line">{address.street}</p>
                        <p className="se-address-line">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="se-address-line">
                          <FaPhone /> {address.phone || 'Not added'}
                        </p>
                        <p className="se-address-line">
                          <FaPhone /> Alt: {address.alternatePhone || 'Not added'}
                        </p>
                        <p className="se-address-line">
                          <FaMapMarkerAlt /> {address.landmark || 'Not added'}
                        </p>
                      </div>
                    </label>
                  );
                })
              ) : (
                <div className="se-empty-state se-no-address-state">
                  <FaMapMarkerAlt />
                  <h3>No saved delivery address yet</h3>
                  <p>Add a new address to continue checkout with delivery details.</p>
                  <button className="se-primary-button" onClick={() => setShowAddressForm(true)}>
                    <FaPlus /> Add delivery address
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="se-checkout-panel se-products-panel">
            <div className="se-panel-header">
              <div>
                <span className="se-panel-eyebrow">Products</span>
                <h2>
                  <FaBoxOpen /> Items in your order
                </h2>
              </div>
            </div>

            <div className="se-products-list">
              {cartItems.length ? (
                cartItems.map((item) => {
                  const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
                  const originalPrice = Number(item.originalPrice || item.price || 0);
                  const currentPrice = Number(item.price || 0);
                  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
                  const rating = item.rating || 4.5;
                  const reviewCount = item.reviewCount || 324;
                  const deliveryDate = new Date();
                  deliveryDate.setDate(deliveryDate.getDate() + 7);
                  const deliveryDateStr = deliveryDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                  const highlights = item.highlights || ['Premium Quality', 'Authentic Product'];
                  
                  return (
                    <article className="se-product-row" key={item.id}>
                        <img
                          src={item.image || item.imageUrl || 'https://via.placeholder.com/120x120?text=Product'}
                          alt={item.name}
                          className="se-product-thumb"
                        />
                      <div className="se-product-copy">
                        <div className="se-product-header-row">
                          <div>
                            <p className="se-product-brand">{item.brand || 'ShopEase Store'}</p>
                            <h3>{item.name}</h3>
                          </div>
                          <div className="se-product-rating-badge">
                            <span className="se-star">★ {rating}</span>
                            <span className="se-reviews">({reviewCount})</span>
                          </div>
                        </div>
                        
                        <div className="se-product-highlights">
                          {highlights.slice(0, 2).map((highlight, idx) => (
                            <span key={idx}>{highlight}</span>
                          ))}
                        </div>
                        
                        <div className="se-product-pricing">
                          <div className="se-price-breakdown">
                            <span className="se-current-price">{currency(currentPrice)}</span>
                            <span className="se-original-price">{currency(originalPrice)}</span>
                            {discountPercent > 0 && <span className="se-discount-badge">{discountPercent}% off</span>}
                          </div>
                          <span className="se-quantity-info">Qty: {item.quantity}</span>
                        </div>
                        
                        <div className="se-product-info-row">
                          <span className="se-info-item">
                            <FaCheckCircle /> Delivers by {deliveryDateStr}
                          </span>
                          <span className="se-info-item"><FaClock /> 24h dispatch</span>
                          <span className="se-info-item"><FaTruck /> Free delivery</span>
                        </div>
                        
                        <div className="se-product-tags">
                          <span className="se-return-badge"><FaCheckCircle /> 7-day returns</span>
                          <span className="se-return-badge"><FaShieldAlt /> Authentic guaranteed</span>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="se-empty-cart-summary">
                  <FaBoxOpen />
                  <p>Your cart is empty.</p>
                  <button className="se-secondary-button" onClick={() => navigate('/cart')}>
                    Go back to cart
                  </button>
                </div>
              )}
            </div>
          </section>

          <aside className="se-checkout-panel se-summary-panel">
            <div className="se-panel-header">
              <div>
                <span className="se-panel-eyebrow">Summary</span>
                <h2>
                  <FaCreditCard /> Order summary
                </h2>
              </div>
            </div>

            <div className="se-summary-card">
              <div className="se-summary-row">
                <span>Price ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                <strong>{currency(totals.original)}</strong>
              </div>
              <div className="se-summary-row">
                <span>Selling price</span>
                <strong>{currency(totals.current)}</strong>
              </div>
              <div className="se-summary-row se-discount-row">
                <span>Discount</span>
                <strong>-{currency(totals.discount)}</strong>
              </div>
              <div className="se-summary-row">
                <span>Delivery charges</span>
                <strong className="se-free">FREE</strong>
              </div>

              <div className="se-summary-divider" />

              <div className="se-summary-row se-grand-total">
                <span>Total amount</span>
                <strong>{currency(totals.payable)}</strong>
              </div>

              <div className="se-order-method-caption">
                <FaWallet />
                <span>
                  Payment options appear after you click Place order.
                </span>
              </div>

              <button
                type="button"
                className="se-place-order-button"
                disabled={!cartItems.length || !selectedAddressId || placingOrder}
                onClick={handleOpenPaymentModal}
              >
                Place order
              </button>

              <div className="se-trust-strip">
                <span><FaShieldAlt /> Secure payments</span>
                <span><FaLock /> Privacy protected</span>
                <span><FaCheckCircle /> Authentic products</span>
              </div>
            </div>

            <div className="se-selected-address-card">
              <div className="se-selected-address-head">
                <span>Delivering to</span>
                <FaPencilAlt />
              </div>
              {selectedAddress ? (
                <>
                  <strong>{profile?.name || 'Customer'}</strong>
                  <p>{selectedAddress.street}</p>
                  <p>
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                  <p>{selectedAddress.phone}</p>
                </>
              ) : (
                <p>Select or add an address to see delivery details here.</p>
              )}
            </div>
          </aside>
        </div>
      </main>
      {showPaymentModal ? (
        <div className="se-payment-modal-backdrop" role="presentation" onClick={handleClosePaymentModal}>
          <div className="se-payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="se-payment-modal-header">
              <div>
                <span className="se-panel-eyebrow">Step 2 of 2</span>
                <h3 id="payment-modal-title">Choose your payment method</h3>
                <p>Select Razorpay for online payment or Cash on Delivery for offline payment at the doorstep.</p>
              </div>
              <button type="button" className="se-modal-close-btn" onClick={handleClosePaymentModal} aria-label="Close payment modal">
                ×
              </button>
            </div>

            <div className="se-payment-options se-payment-modal-options" role="radiogroup" aria-label="Payment methods">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const active = paymentMethod === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`se-payment-card ${active ? 'is-active' : ''} se-payment-${option.tone}`}
                    onClick={() => setPaymentMethod(option.id)}
                    aria-pressed={active}
                  >
                    <div className="se-payment-card-top">
                      <div className="se-payment-icon-wrap">
                        <Icon />
                      </div>
                      <div className="se-payment-card-copy">
                        <div className="se-payment-title-row">
                          <strong>{option.title}</strong>
                          {active ? <span className="se-payment-selected-pill"><FaCheckCircle /> Selected</span> : <span className="se-payment-chip">{option.badge}</span>}
                        </div>
                        <span className="se-payment-subtitle">{option.subtitle}</span>
                      </div>
                    </div>

                    <p className="se-payment-description">{option.description}</p>

                    <div className="se-payment-features">
                      {option.highlights.map((item) => (
                        <span key={`${option.id}-${item}`}>{item}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="se-payment-modal-footer">
              <div className="se-payment-note">
                {paymentMethod === 'COD' ? (
                  <>
                    <FaMoneyBillWave /> Cash will be collected when your order is delivered.
                  </>
                ) : (
                  <>
                    <FaMobileAlt /> Razorpay will show UPI, cards, net banking and EMI after you continue.
                  </>
                )}
              </div>

              <div className="se-payment-modal-actions">
                <button type="button" className="se-secondary-button" onClick={handleClosePaymentModal} disabled={placingOrder}>
                  Back
                </button>
                <button type="button" className="se-primary-button" onClick={handleConfirmOrder} disabled={placingOrder}>
                  {placingOrder ? 'Processing...' : paymentMethod === 'COD' ? 'Confirm COD order' : 'Continue to secure payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </div>
  );
}

export default Checkout;