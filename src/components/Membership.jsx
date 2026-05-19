import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaTimes,
  FaCheck,
  FaTruck,
  FaShippingFast,
  FaTag,
  FaGift,
  FaStar,
  FaHeadset,
  FaFire,
  FaAward,
  FaCrown,
  FaLock,
  FaShieldAlt,
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiRazorpay } from 'react-icons/si';
import {
  createMembershipPaymentOrder,
  getLoggedInUser,
  getMembershipPlans,
  getMembershipStatus,
  hasMembershipFeature,
  reportPaymentFailure,
  verifyPaymentOrder,
} from '../services/api';

const FALLBACK_PLANS = [
  {
    id: 'PLUS',
    displayName: 'Plus',
    monthlyPrice: 99,
    yearlyPrice: 999,
    description: 'Great basics for smart shopping',
    features: [
      'FREE_DELIVERY',
      'FAST_SHIPPING',
      'EXCLUSIVE_DISCOUNTS',
      'CASHBACK',
      'EARLY_ACCESS',
      'PERSONALIZED_RECOMMENDATIONS',
    ],
  },
  {
    id: 'PREMIUM',
    displayName: 'Premium',
    monthlyPrice: 299,
    yearlyPrice: 2999,
    description: 'Best value with premium perks',
    features: [
      'FREE_DELIVERY',
      'FAST_SHIPPING',
      'EXCLUSIVE_DISCOUNTS',
      'CASHBACK',
      'EARLY_ACCESS',
      'PRIORITY_SUPPORT',
      'PERSONALIZED_RECOMMENDATIONS',
    ],
  },
  {
    id: 'ELITE',
    displayName: 'Elite',
    monthlyPrice: 599,
    yearlyPrice: 5999,
    description: 'Ultimate luxury shopping experience',
    features: [
      'FREE_DELIVERY',
      'FAST_SHIPPING',
      'EXCLUSIVE_DISCOUNTS',
      'CASHBACK',
      'EARLY_ACCESS',
      'PRIORITY_SUPPORT',
      'PERSONALIZED_RECOMMENDATIONS',
      'VIP_DEALS',
    ],
  },
];

const featureLabels = {
  FREE_DELIVERY: 'Free Delivery',
  FAST_SHIPPING: 'Faster Shipping',
  EXCLUSIVE_DISCOUNTS: 'Exclusive Discounts',
  CASHBACK: 'Cashback',
  EARLY_ACCESS: 'Early Access to Products',
  PRIORITY_SUPPORT: 'Priority Support',
  PERSONALIZED_RECOMMENDATIONS: 'Personalized Recommendations',
  VIP_DEALS: 'VIP Member-only Deals',
};

const planMeta = {
  PLUS: {
    icon: FaStar,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: '#3b82f6',
    badge: null,
  },
  PREMIUM: {
    icon: FaCrown,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#f59e0b',
    badge: 'MOST POPULAR',
  },
  ELITE: {
    icon: FaAward,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: '#8b5cf6',
    badge: 'ULTIMATE',
  },
};

function Membership({ isOpen, onClose }) {
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [subscribingPlan, setSubscribingPlan] = useState(null);
  const [memberStatus, setMemberStatus] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [accessPreview, setAccessPreview] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(plans[1]?.id || plans[0]?.id);
  const [showPriceCard, setShowPriceCard] = useState(false);
  const [confirmState, setConfirmState] = useState('idle'); // idle | loading | success

  const loggedInUser = useMemo(() => getLoggedInUser(), []);

  useEffect(() => {
    if (!isOpen || !loggedInUser?.id) {
      return;
    }

    const loadMembershipData = async () => {
      setLoadingPlans(true);
      try {
        const [apiPlans, status] = await Promise.all([
          getMembershipPlans(),
          getMembershipStatus(loggedInUser.id),
        ]);
        if (Array.isArray(apiPlans) && apiPlans.length > 0) {
          setPlans(apiPlans);
        }
        if (status) {
          setMemberStatus(status);
        }
      } catch {
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoadingPlans(false);
      }
    };

    loadMembershipData();
  }, [isOpen, loggedInUser?.id]);

  useEffect(() => {
    if (!isOpen || !loggedInUser?.id) {
      return;
    }

    const previewAccess = async () => {
      try {
        const access = await hasMembershipFeature(loggedInUser.id, 'PRIORITY_SUPPORT');
        setAccessPreview(access);
      } catch {
        setAccessPreview(null);
      }
    };

    previewAccess();
  }, [isOpen, loggedInUser?.id]);

  const comparisonFeatures = [
    'FREE_DELIVERY',
    'FAST_SHIPPING',
    'EXCLUSIVE_DISCOUNTS',
    'CASHBACK',
    'EARLY_ACCESS',
    'PRIORITY_SUPPORT',
    'PERSONALIZED_RECOMMENDATIONS',
    'VIP_DEALS',
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

  const computePriceDetails = (plan, cycle) => {
    const taxPercent = 18; // GST
    const base = cycle === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyPrice;
    let monthlyEquivalent = null;
    let discountAmount = 0;
    let discountPercent = 0;

    if (cycle === 'YEARLY') {
      const monthlyTotal = plan.monthlyPrice * 12;
      discountAmount = Math.max(0, monthlyTotal - plan.yearlyPrice);
      discountPercent = monthlyTotal > 0 ? Math.round((discountAmount / monthlyTotal) * 100) : 0;
      monthlyEquivalent = (plan.yearlyPrice / 12).toFixed(2);
    }

    const subtotal = +(base - discountAmount).toFixed(2);
    const tax = +(subtotal * (taxPercent / 100)).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    return {
      currency: 'INR',
      base: +base,
      discountAmount: +discountAmount,
      discountPercent,
      subtotal,
      taxPercent,
      tax,
      total,
      monthlyEquivalent,
    };
  };

  const handleSubscribe = async (planId) => {
    if (!loggedInUser?.id) {
      return;
    }

    setSubscribingPlan(planId);
    setPaymentError('');

    try {
      const paymentOrder = await createMembershipPaymentOrder({
        userId: loggedInUser.id,
        plan: planId,
        billingCycle,
        autoRenew: true,
        metadata: {
          feature: 'MEMBERSHIP_SUBSCRIPTION',
        },
      });

      const isScriptReady = await loadRazorpayScript();
      if (!isScriptReady) {
        throw new Error('Unable to load Razorpay checkout. Please try again.');
      }

      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amountPaise,
        currency: paymentOrder.currency,
        name: 'ShopEase Premium Membership',
        description: paymentOrder.description,
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: loggedInUser.name || '',
          email: loggedInUser.email || '',
        },
        notes: {
          paymentTransactionId: paymentOrder.paymentTransactionId,
          plan: paymentOrder.plan,
          billingCycle: paymentOrder.billingCycle,
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
              // ignore failure tracking errors
            }
            setPaymentError('Payment was cancelled.');
            setSubscribingPlan(null);
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

            if (verification?.membership) {
              setMemberStatus(verification.membership);
            }
            toast.success(verification?.message || 'Membership activated successfully');
          } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Payment verification failed';
            setPaymentError(message);
            toast.error(message);
          } finally {
            setSubscribingPlan(null);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
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

        const message = response?.error?.description || response?.error?.reason || 'Payment failed';
        setPaymentError(message);
        toast.error(message);
        setSubscribingPlan(null);
      });

      razorpay.open();
    } catch (error) {
      const serverData = error?.response?.data;
      const message = serverData?.message || serverData?.detail || serverData?.error || (typeof serverData === 'string' ? serverData : null) || error?.message || 'Unable to start payment checkout';
      setPaymentError(message);
      toast.error(message);
      setSubscribingPlan(null);
    }
  };

  const confirmSubscribe = (planId) => {
    setSelectedPlanId(planId);
    setShowPriceCard(true);
    // bring the summary into view
    setTimeout(() => {
      const el = document.querySelector('.se-price-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleConfirmProceed = async (planId) => {
    setConfirmState('loading');
    try {
      await handleSubscribe(planId);
      // let Razorpay handle the flow; show a small success visual before closing
      setConfirmState('success');
      setTimeout(() => {
        setConfirmState('idle');
        setShowPriceCard(false);
      }, 700);
    } catch (err) {
      setConfirmState('idle');
      setShowPriceCard(false);
    }
  };

  useEffect(() => {
    // if subscribing finished, revert any loading state
    if (!subscribingPlan && confirmState === 'loading') {
      setConfirmState('idle');
    }
  }, [subscribingPlan, confirmState]);

  useEffect(() => {
    // if membership activated for selected plan, show success briefly
    if (memberStatus && memberStatus.plan === selectedPlanId) {
      setConfirmState('success');
      setTimeout(() => setConfirmState('idle'), 1200);
    }
  }, [memberStatus, selectedPlanId]);

  if (!isOpen) return null;

  return (
    <>
      <div className="se-membership-backdrop" onClick={onClose} />

      <div className="se-membership-modal">
        <div className="se-membership-header">
          <div className="se-membership-header-content">
            <div className="se-membership-title-icon">
              <FaCrown />
            </div>
            <div>
              <h1>ShopEase Premium Membership</h1>
              <p>Amazon Prime and Flipkart Plus style tiers with premium benefits</p>
            </div>
          </div>
          <button className="se-membership-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="se-membership-content">
          <div className="se-membership-grid">
            <div className="se-plans-area">
              <div className="se-billing-toggle-section">
                <div className="se-billing-toggle">
                  <button
                    className={`se-billing-btn ${billingCycle === 'MONTHLY' ? 'active' : ''}`}
                    onClick={() => setBillingCycle('MONTHLY')}
                  >
                    Monthly
                  </button>
                  <button
                    className={`se-billing-btn ${billingCycle === 'YEARLY' ? 'active' : ''}`}
                    onClick={() => setBillingCycle('YEARLY')}
                  >
                    Yearly
                    <span className="se-save-badge">Save 17%</span>
                  </button>
                </div>
              </div>

              {memberStatus?.active ? (
                <div className="se-active-membership-note">
                  Active Plan: <strong>{memberStatus.plan}</strong> · Billing: {memberStatus.billingCycle}
                </div>
              ) : null}

              {accessPreview?.allowed ? (
                <div className="se-access-note se-access-allowed">Priority Support access: Enabled</div>
              ) : (
                <div className="se-access-note">Priority Support access: Upgrade required</div>
              )}

              {paymentError ? (
                <div className="se-payment-alert" role="alert">
                  <div className="se-payment-alert-icon"><FaTimes /></div>
                  <div className="se-payment-alert-body">
                    <div className="se-payment-alert-title">Payment was cancelled</div>
                    <div className="se-payment-alert-message">{paymentError}</div>
                  </div>
                </div>
              ) : null}

              <div className="se-plans-grid">
            {plans.map((plan) => {
              const meta = planMeta[plan.id] || planMeta.PLUS;
              const PlanIcon = meta.icon;
              const price = billingCycle === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`se-plan-card ${plan.id === 'PREMIUM' ? 'featured' : ''} ${selectedPlanId === plan.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlanId(plan.id)}
                  role="button"
                  tabIndex={0}
                >
                  {meta.badge && <div className="se-plan-badge">{meta.badge}</div>}

                  <div className="se-plan-header" style={{ backgroundImage: meta.gradient }}>
                    <div className="se-plan-icon">
                      <PlanIcon />
                    </div>
                    <h2>{plan.displayName}</h2>
                    <p>{plan.description}</p>
                  </div>

                  <div className="se-plan-pricing">
                    <div className="se-price-display">
                      <span className="se-currency">₹</span>
                      <span className="se-amount">{price}</span>
                      <span className="se-period">/{billingCycle === 'MONTHLY' ? 'month' : 'year'}</span>
                    </div>
                  </div>

                      <button
                        className="se-plan-button"
                        onClick={() => confirmSubscribe(plan.id)}
                        disabled={subscribingPlan === plan.id || loadingPlans}
                        style={{ background: meta.gradient, borderColor: meta.color }}
                      >
                        {subscribingPlan === plan.id ? 'Subscribing...' : 'Subscribe Now'}
                      </button>

                  <div className="se-plan-features">
                    {comparisonFeatures.map((feature) => {
                      const included = plan.features?.includes(feature);
                      return (
                        <div key={`${plan.id}-${feature}`} className="se-feature">
                          <div className={`se-feature-icon ${included ? 'included' : 'excluded'}`}>
                            {included ? <FaCheck /> : '✕'}
                          </div>
                          <span className={included ? 'included' : 'excluded'}>{featureLabels[feature]}</span>
                          {included && plan.id !== 'PLUS' ? <FaFire className="se-premium-badge" /> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="se-features-overview">
            <h2>Premium Benefits</h2>
            <div className="se-features-grid">
              <div className="se-feature-card">
                <div className="se-feature-card-icon" style={{ backgroundColor: '#3b82f614' }}><FaTruck style={{ color: '#3b82f6' }} /></div>
                <h3>Free & Fast Delivery</h3>
                <p>Faster shipping windows with no delivery fees.</p>
              </div>
              <div className="se-feature-card">
                <div className="se-feature-card-icon" style={{ backgroundColor: '#ec489914' }}><FaTag style={{ color: '#ec4899' }} /></div>
                <h3>Exclusive Discounts</h3>
                <p>Member-only prices and special sale events.</p>
              </div>
              <div className="se-feature-card">
                <div className="se-feature-card-icon" style={{ backgroundColor: '#10b98114' }}><FaGift style={{ color: '#10b981' }} /></div>
                <h3>Cashback Rewards</h3>
                <p>Earn cashback on each eligible order.</p>
              </div>
              <div className="se-feature-card">
                <div className="se-feature-card-icon" style={{ backgroundColor: '#f5950015' }}><FaShippingFast style={{ color: '#f59e0b' }} /></div>
                <h3>Priority Support</h3>
                <p>Faster issue resolution with premium support queue.</p>
              </div>
              <div className="se-feature-card">
                <div className="se-feature-card-icon" style={{ backgroundColor: '#06b6d414' }}><FaFire style={{ color: '#06b6d4' }} /></div>
                <h3>Early Access</h3>
                <p>Shop product drops before general public release.</p>
              </div>
              <div className="se-feature-card">
                <div className="se-feature-card-icon" style={{ backgroundColor: '#8b5cf614' }}><FaHeadset style={{ color: '#8b5cf6' }} /></div>
                <h3>Personalized Recommendations</h3>
                <p>Smart recommendations tailored to your shopping profile.</p>
              </div>
            </div>
          </div>

          <div className="se-comparison-section">
            <button className="se-comparison-btn" onClick={() => setShowComparison((current) => !current)}>
              {showComparison ? 'Hide' : 'View'} Feature Comparison
            </button>

            {showComparison ? (
              <div className="se-comparison-table">
                <table>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      {plans.map((plan) => {
                        const meta = planMeta[plan.id] || planMeta.PLUS;
                        const PlanIcon = meta.icon;
                        return (
                          <th key={`${plan.id}-head`} style={{ color: meta.color }}>
                            <div className="se-table-header">
                              <PlanIcon />
                              {plan.displayName}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature) => (
                      <tr key={`cmp-${feature}`}>
                        <td className="se-feature-name">{featureLabels[feature]}</td>
                        {plans.map((plan) => (
                          <td key={`${plan.id}-${feature}`} className="se-feature-cell">
                            {plan.features?.includes(feature) ? (
                              <div className="se-check-mark"><FaCheck /></div>
                            ) : (
                              <div className="se-cross-mark">✕</div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            </div>
          </div>
        </div>
        </div>
        </div>

        {showPriceCard && (() => {
          const plan = plans.find((p) => p.id === selectedPlanId) || plans[0];
          const meta = planMeta[plan.id] || planMeta.PLUS;
          const PlanIcon = meta.icon;
          const details = computePriceDetails(plan, billingCycle);
          return (
            <div className="se-price-popup-overlay">
              <div className="se-price-popup-backdrop" onClick={() => setShowPriceCard(false)} />
              <div className="se-price-popup-card" role="dialog" aria-modal="true">
                <div className="se-price-popup-header">
                  <div className="se-price-popup-brand">
                    <div className="se-price-plan-pill" style={{ backgroundImage: meta.gradient }}>
                      <PlanIcon />
                    </div>
                    <div className="se-price-popup-title-group">
                      <h3 className="se-price-popup-title">Confirm Purchase</h3>
                      <div className="se-price-popup-subtitle">Secure &amp; fast checkout — ShopEase</div>
                    </div>
                  </div>
                  <button className="se-price-popup-close" onClick={() => setShowPriceCard(false)} aria-label="Close">×</button>
                </div>

                <div className="se-price-popup-body">
                  <div className="se-price-left">
                    <div className="se-price-meta">
                      <div className="se-price-name">{plan.displayName}</div>
                      <div className="se-price-desc">{plan.description}</div>
                    </div>
                    <div className="se-price-amount">
                      <div className="se-price-currency">₹</div>
                      <div className="se-price-value">{details.total.toFixed(2)}</div>
                      <div className="se-price-period">/{billingCycle === 'MONTHLY' ? 'month' : 'year'}</div>
                    </div>
                    <div className="se-trust-row">
                      <div className="se-trust-item">
                        <span className="se-trust-lock-pill"><FaLock /></span>
                        <span>Secure Payment</span>
                      </div>
                      <div className="se-trust-icons">
                        <span className="se-payment-badge visa"><SiVisa /></span>
                        <span className="se-payment-badge mastercard"><SiMastercard /></span>
                        <span className="se-payment-badge razorpay"><SiRazorpay /></span>
                        <span className="se-payment-badge shield"><FaShieldAlt /></span>
                      </div>
                    </div>
                  </div>

                  <div className="se-price-right">
                    <div className="se-price-popup-summary se-price-summary-panel">
                      {details.discountAmount > 0 && (
                        <div className="se-price-row"><span>Discount</span><strong>-₹{details.discountAmount.toFixed(2)}</strong></div>
                      )}
                      <div className="se-price-row"><span>Subtotal</span><strong>₹{details.subtotal.toFixed(2)}</strong></div>
                      <div className="se-price-row"><span>GST ({details.taxPercent}%)</span><strong>₹{details.tax.toFixed(2)}</strong></div>
                      <div className="se-price-row se-total"><span className="se-total-label">Total</span><span className="se-total-amount">₹{details.total.toFixed(2)}</span></div>
                      {details.monthlyEquivalent && <div className="se-price-note">Equivalent to ₹{details.monthlyEquivalent}/month</div>}
                    </div>

                    <div className="se-price-popup-actions">
                      <button
                        className={`se-price-popup-confirm se-plan-button se-panel-continue ${confirmState === 'loading' ? 'loading' : ''} ${confirmState === 'success' ? 'success' : ''}`}
                        onClick={() => handleConfirmProceed(plan.id)}
                        disabled={subscribingPlan === plan.id || loadingPlans || confirmState === 'loading'}
                      >
                        {confirmState === 'loading' ? 'Processing...' : confirmState === 'success' ? '✓ Payment started' : 'Proceed to payment'}
                      </button>
                      <button className="se-price-popup-cancel" onClick={() => setShowPriceCard(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </>
    );
}

export default Membership;
