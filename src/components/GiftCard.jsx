import { useMemo, useState } from 'react';
import {
  FaAward,
  FaBirthdayCake,
  FaCreditCard,
  FaGift,
  FaHistory,
  FaLeaf,
  FaPaperPlane,
  FaPiggyBank,
  FaStar,
  FaTag,
  FaTimes,
  FaWallet,
} from 'react-icons/fa';

const amountOptions = [500, 1000, 2000, 5000, 10000];

const designOptions = [
  {
    id: 'birthday',
    label: 'Birthday',
    icon: FaBirthdayCake,
    gradient: 'linear-gradient(135deg, #ff8a65 0%, #c084fc 55%, #6366f1 100%)',
    tagline: 'Celebrate birthdays with a premium surprise',
  },
  {
    id: 'festival',
    label: 'Festival',
    icon: FaStar,
    gradient: 'linear-gradient(135deg, #f4b860 0%, #f87171 52%, #8b5cf6 100%)',
    tagline: 'Perfect for festive gifting and celebrations',
  },
  {
    id: 'celebration',
    label: 'Celebration',
    icon: FaAward,
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #14b8a6 52%, #0f766e 100%)',
    tagline: 'A polished design for milestones and wins',
  },
  {
    id: 'classic',
    label: 'Classic',
    icon: FaGift,
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1e293b 100%)',
    tagline: 'Minimal, modern and suitable for any occasion',
  },
  {
    id: 'green',
    label: 'Eco',
    icon: FaLeaf,
    gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 48%, #0f766e 100%)',
    tagline: 'Fresh and bright for thoughtful gifting',
  },
];

const quickFacts = [
  { icon: FaPaperPlane, label: 'Instant delivery' },
  { icon: FaCreditCard, label: 'Secure checkout' },
  { icon: FaWallet, label: 'Backend-ready balance' },
];

const historyPlaceholders = [
  {
    icon: FaPiggyBank,
    title: 'Purchase history',
    note: 'Saved gift card orders will appear here after backend integration.',
  },
  {
    icon: FaHistory,
    title: 'Redemption timeline',
    note: 'Track issued, sent and redeemed cards from the database.',
  },
];

function GiftCard({ isOpen, onClose }) {
  const [activeMode, setActiveMode] = useState('dashboard');
  const [selectedAmount, setSelectedAmount] = useState(amountOptions[1]);
  const [quantity, setQuantity] = useState(1);
  const [selectedDesign, setSelectedDesign] = useState(designOptions[0].id);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [redeemCode, setRedeemCode] = useState('');

  const currentDesign = useMemo(
    () => designOptions.find((item) => item.id === selectedDesign) || designOptions[0],
    [selectedDesign],
  );
  const PreviewIcon = currentDesign.icon;
  const subtotal = selectedAmount * quantity;

  const actionTiles = [
    {
      id: 'send',
      title: 'Send Gift',
      desc: 'Send a personalized card instantly.',
      icon: FaPaperPlane,
      tone: 'blue',
    },
    {
      id: 'buy',
      title: 'Buy Gift',
      desc: 'Choose a template, amount and quantity.',
      icon: FaCreditCard,
      tone: 'violet',
    },
    {
      id: 'redeem',
      title: 'Redeem Code',
      desc: 'Apply a code to the wallet securely.',
      icon: FaTag,
      tone: 'green',
    },
  ];

  const suggestionCards = [
    {
      icon: FaPaperPlane,
      title: 'Send a gift to friends',
      note: 'Share balance or a custom card with a quick checkout flow.',
    },
    {
      icon: FaStar,
      title: 'Celebrate occasions',
      note: 'Use festive templates for birthdays, milestones and more.',
    },
    {
      icon: FaTag,
      title: 'Special offers',
      note: 'Surface seasonal promos and eligible gift card offers.',
    },
  ];

  const walletCards = [
    {
      title: 'Gift balance',
      value: '--',
      note: 'Live wallet data will appear here from the backend.',
      icon: FaWallet,
    },
    {
      title: 'Active gift cards',
      value: '--',
      note: 'Issued cards and redemptions will be shown in real time.',
      icon: FaGift,
    },
    {
      title: 'Recent activity',
      value: '--',
      note: 'View recent purchases, sends and code redemptions.',
      icon: FaHistory,
    },
  ];

  if (!isOpen) {
    return null;
  }

  const handleQuantityChange = (delta) => {
    setQuantity((value) => Math.max(1, value + delta));
  };

  const renderSummary = () => (
    <div className="se-giftcard-compact-summary">
      <div>
        <span>Card amount</span>
        <strong>₹{selectedAmount.toLocaleString()}</strong>
      </div>
      <div>
        <span>Quantity</span>
        <strong>{quantity}</strong>
      </div>
      <div>
        <span>Total</span>
        <strong>₹{subtotal.toLocaleString()}</strong>
      </div>
    </div>
  );

  const renderWorkspace = () => {
    if (activeMode === 'send') {
      return (
        <section className="se-giftcard-workspace">
          <div className="se-workspace-header">
            <div>
              <span className="se-workspace-kicker">Send Gift</span>
              <h3>Personalize and send in seconds</h3>
            </div>
            <button type="button" className="se-workspace-link" onClick={() => setActiveMode('dashboard')}>
              Back to dashboard
            </button>
          </div>

          <div className="se-giftcard-workspace-grid">
            <div className="se-workspace-card">
              <div className="se-form-group">
                <label htmlFor="recipient-name">Recipient name</label>
                <input
                  id="recipient-name"
                  className="se-form-input"
                  type="text"
                  value={recipientName}
                  onChange={(event) => setRecipientName(event.target.value)}
                  placeholder="Enter recipient name"
                />
              </div>

              <div className="se-form-group">
                <label htmlFor="recipient-email">Recipient email</label>
                <input
                  id="recipient-email"
                  className="se-form-input"
                  type="email"
                  value={recipientEmail}
                  onChange={(event) => setRecipientEmail(event.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="se-form-group">
                <label htmlFor="sender-name">Sender name</label>
                <input
                  id="sender-name"
                  className="se-form-input"
                  type="text"
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="se-form-group">
                <label htmlFor="gift-message">Message</label>
                <textarea
                  id="gift-message"
                  className="se-form-textarea"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write a personal message..."
                  maxLength={160}
                />
              </div>
            </div>

            <aside className="se-workspace-preview">
              <div className="se-wallet-preview-card" style={{ background: currentDesign.gradient }}>
                <div className="se-wallet-preview-top">
                  <span>Delivery preview</span>
                  <span>ShopEase</span>
                </div>
                <div className="se-wallet-preview-value">₹{subtotal.toLocaleString()}</div>
                <div className="se-wallet-preview-note">{currentDesign.label} · personalized delivery</div>
              </div>
              {renderSummary()}
            </aside>
          </div>
        </section>
      );
    }

    if (activeMode === 'buy') {
      return (
        <section className="se-giftcard-workspace">
          <div className="se-workspace-header">
            <div>
              <span className="se-workspace-kicker">Buy Gift</span>
              <h3>Pick a design and set the value</h3>
            </div>
            <button type="button" className="se-workspace-link" onClick={() => setActiveMode('dashboard')}>
              Back to dashboard
            </button>
          </div>

          <div className="se-giftcard-workspace-grid">
            <div className="se-workspace-card">
              <div className="se-design-grid se-design-grid--compact">
                {designOptions.map((design) => {
                  const DesignIcon = design.icon;
                  const isSelected = selectedDesign === design.id;
                  return (
                    <button
                      key={design.id}
                      type="button"
                      className={`se-design-card ${isSelected ? 'selected' : ''}`}
                      style={{ background: design.gradient }}
                      onClick={() => setSelectedDesign(design.id)}
                    >
                      <div className="se-design-card-top">
                        <span className="se-design-icon" aria-hidden="true">
                          <DesignIcon />
                        </span>
                        <span className="se-design-pip">{isSelected ? 'Selected' : 'Preview'}</span>
                      </div>
                      <div className="se-design-name">{design.label}</div>
                      <div className="se-design-tagline">{design.tagline}</div>
                    </button>
                  );
                })}
              </div>

              <div className="se-amount-grid se-amount-grid--compact">
                {amountOptions.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`se-amount-card ${selectedAmount === amount ? 'selected' : ''}`}
                    onClick={() => setSelectedAmount(amount)}
                  >
                    <div className="se-amount-value">₹{amount.toLocaleString()}</div>
                    <div className="se-amount-label">Gift card value</div>
                    {selectedAmount === amount ? <span className="se-amount-check">✓</span> : null}
                  </button>
                ))}
              </div>

              <div className="se-form-row">
                <div className="se-form-group">
                  <label htmlFor="giftcard-qty">Quantity</label>
                  <div className="se-quantity-selector">
                    <button type="button" className="se-qty-btn" onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">
                      −
                    </button>
                    <input
                      id="giftcard-qty"
                      className="se-qty-input"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                    />
                    <button type="button" className="se-qty-btn" onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                </div>

                <button type="button" className="se-giftcard-action-btn se-giftcard-action-btn--soft">
                  Continue to checkout
                </button>
              </div>
            </div>

            <aside className="se-workspace-preview">
              <div className="se-wallet-preview-card" style={{ background: currentDesign.gradient }}>
                <div className="se-wallet-preview-top">
                  <span>{currentDesign.label}</span>
                  <span>ShopEase</span>
                </div>
                <div className="se-wallet-preview-value">₹{subtotal.toLocaleString()}</div>
                <div className="se-wallet-preview-note">Ready for personalized checkout</div>
              </div>
              {renderSummary()}
            </aside>
          </div>
        </section>
      );
    }

    if (activeMode === 'redeem') {
      return (
        <section className="se-giftcard-workspace">
          <div className="se-workspace-header">
            <div>
              <span className="se-workspace-kicker">Redeem Code</span>
              <h3>Apply a gift code to the wallet</h3>
            </div>
            <button type="button" className="se-workspace-link" onClick={() => setActiveMode('dashboard')}>
              Back to dashboard
            </button>
          </div>

          <div className="se-giftcard-workspace-grid">
            <div className="se-workspace-card">
              <div className="se-form-group">
                <label htmlFor="redeem-code">Gift card code</label>
                <input
                  id="redeem-code"
                  className="se-form-input se-code-input"
                  type="text"
                  value={redeemCode}
                  onChange={(event) => setRedeemCode(event.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX-XXXX"
                />
              </div>

              <div className="se-redeem-note-card">
                <strong>Backend-ready redemption</strong>
                <p>Codes can be validated, logged, and applied to the wallet once the API is connected.</p>
              </div>

              <button type="button" className="se-giftcard-action-btn se-giftcard-action-btn--soft">
                Validate & redeem
              </button>
            </div>

            <aside className="se-workspace-preview">
              <div className="se-wallet-preview-card se-wallet-preview-card--muted">
                <div className="se-wallet-preview-top">
                  <span>Live balance</span>
                  <span>Protected</span>
                </div>
                <div className="se-wallet-preview-value">--</div>
                <div className="se-wallet-preview-note">No fake wallet values shown before backend integration.</div>
              </div>
              <div className="se-redeem-note-card">
                <strong>Secure flow</strong>
                <p>Redemption events, balance updates and audit logs can be driven from the auth service.</p>
              </div>
            </aside>
          </div>
        </section>
      );
    }

    if (activeMode === 'history') {
      return (
        <section className="se-giftcard-workspace">
          <div className="se-workspace-header">
            <div>
              <span className="se-workspace-kicker">Wallet & Gifts</span>
              <h3>Balance, active cards and recent activity</h3>
            </div>
            <button type="button" className="se-workspace-link" onClick={() => setActiveMode('dashboard')}>
              Back to dashboard
            </button>
          </div>

          <div className="se-giftcard-history-grid">
            <div className="se-giftcard-dashboard-grid">
              {walletCards.map((tile) => {
                const Icon = tile.icon;
                return (
                  <section key={tile.title} className="se-giftcard-dashboard-card">
                    <div className="se-giftcard-dashboard-top">
                      <span className="se-giftcard-dashboard-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className="se-giftcard-dashboard-chip">Live-ready</span>
                    </div>
                    <div className="se-giftcard-dashboard-value">{tile.value}</div>
                    <div className="se-giftcard-dashboard-title">{tile.title}</div>
                    <p>{tile.note}</p>
                  </section>
                );
              })}
            </div>

            <div className="se-history-list-card">
              <div className="se-section-heading se-section-heading--tight">
                <div>
                  <h2>Recent activity</h2>
                  <p>Transactions will stream from the backend in real time.</p>
                </div>
                <span className="se-section-heading-chip">API feed</span>
              </div>
              <div className="se-history-list">
                {historyPlaceholders.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="se-history-item">
                      <div className="se-history-icon" aria-hidden="true">
                        <Icon />
                      </div>
                      <div>
                        <div className="se-history-title">{item.title}</div>
                        <div className="se-history-date">Ready for API-backed records</div>
                      </div>
                      <div className="se-history-status active">Pending</div>
                      <div className="se-history-amount">--</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <>
      <div className="se-giftcard-backdrop" onClick={onClose} />

      <div className="se-giftcard-modal" role="dialog" aria-modal="true" aria-labelledby="giftcard-title">
        <div className="se-giftcard-header">
          <div className="se-giftcard-header-content">
            <div className="se-giftcard-title-icon" aria-hidden="true">
              <FaGift />
            </div>
            <div>
              <h1 id="giftcard-title">ShopEase Gift Cards</h1>
              <p>Wallet & Gifts dashboard with premium actions and live-ready data slots</p>
            </div>
          </div>

          <button type="button" className="se-giftcard-close" onClick={onClose} aria-label="Close gift card dialog">
            <FaTimes />
          </button>
        </div>

        <div className="se-giftcard-content">
          <div className="se-giftcard-dashboard-shell">
            <section className="se-giftcard-hero se-giftcard-hero--dashboard">
              <div className="se-giftcard-hero-copy">
                <div className="se-giftcard-hero-badge">Wallet & Gifts</div>
                <h2>Manage balance, send gifts and track activity in one premium dashboard</h2>
                <p>
                  A clean, app-like experience for gift balance, active cards and modern gifting actions.
                </p>

                <div className="se-giftcard-hero-chips">
                  {quickFacts.map((item) => {
                    const Icon = item.icon;
                    return (
                      <span key={item.label} className="se-giftcard-hero-chip">
                        <Icon /> {item.label}
                      </span>
                    );
                  })}
                </div>

                <div className="se-giftcard-mini-actions">
                  <button type="button" onClick={() => setActiveMode('send')}>Send Gift</button>
                  <button type="button" onClick={() => setActiveMode('buy')}>Buy Gift</button>
                  <button type="button" onClick={() => setActiveMode('redeem')}>Redeem Code</button>
                </div>
              </div>

              <div className="se-giftcard-wallet-preview-wrap">
                <div className="se-wallet-preview-card se-wallet-preview-card--hero" style={{ background: currentDesign.gradient }}>
                  <div className="se-wallet-preview-top">
                    <span>Gift balance</span>
                    <span>Live-ready</span>
                  </div>
                  <div className="se-wallet-preview-value">₹{subtotal.toLocaleString()}</div>
                  <div className="se-wallet-preview-note">{currentDesign.label} template preview</div>
                </div>
                <div className="se-wallet-preview-meta">
                  <div>
                    <strong>Active design</strong>
                    <span>{currentDesign.label}</span>
                  </div>
                  <div>
                    <strong>Status</strong>
                    <span>Backend-ready</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="se-giftcard-stats-grid">
              {walletCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title} className="se-wallet-card">
                    <div className="se-wallet-card-icon">
                      <Icon />
                    </div>
                    <div className="se-wallet-card-value">{card.value}</div>
                    <div className="se-wallet-card-title">{card.title}</div>
                    <p>{card.note}</p>
                  </article>
                );
              })}
            </section>

            <section className="se-giftcard-actions-strip">
              {actionTiles.map((item) => {
                const Icon = item.icon;
                const active = activeMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`se-action-tile tone-${item.tone} ${active ? 'active' : ''}`}
                    onClick={() => setActiveMode(item.id)}
                  >
                    <span className="se-action-tile-icon">
                      <Icon />
                    </span>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </button>
                );
              })}
            </section>

            <section className="se-giftcard-template-area">
              <div className="se-section-heading se-section-heading--tight">
                <div>
                  <h2>Gift card templates</h2>
                  <p>Choose a visual style that fits birthdays, festivals and special moments.</p>
                </div>
                <span className="se-section-heading-chip">Interactive tiles</span>
              </div>
              <div className="se-design-grid se-design-grid--dashboard">
                {designOptions.map((design) => {
                  const DesignIcon = design.icon;
                  const isSelected = selectedDesign === design.id;
                  return (
                    <button
                      key={design.id}
                      type="button"
                      className={`se-design-card ${isSelected ? 'selected' : ''}`}
                      style={{ background: design.gradient }}
                      onClick={() => setSelectedDesign(design.id)}
                    >
                      <div className="se-design-card-top">
                        <span className="se-design-icon" aria-hidden="true">
                          <DesignIcon />
                        </span>
                        <span className="se-design-pip">{isSelected ? 'Selected' : 'Preview'}</span>
                      </div>
                      <div className="se-design-name">{design.label}</div>
                      <div className="se-design-tagline">{design.tagline}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="se-giftcard-suggestions">
              <div className="se-section-heading se-section-heading--tight">
                <div>
                  <h2>Personalized suggestions</h2>
                  <p>Useful prompts for an app-like gifting experience.</p>
                </div>
              </div>
              <div className="se-suggestion-grid">
                {suggestionCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="se-suggestion-card">
                      <span className="se-suggestion-icon">
                        <Icon />
                      </span>
                      <strong>{item.title}</strong>
                      <p>{item.note}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="se-giftcard-activity-grid">
              <div className="se-history-list-card">
                <div className="se-section-heading se-section-heading--tight">
                  <div>
                    <h2>Recent activity</h2>
                    <p>All backend events can be streamed here in a clean timeline.</p>
                  </div>
                  <span className="se-section-heading-chip">Live feed</span>
                </div>
                <div className="se-history-list">
                  {historyPlaceholders.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="se-history-item">
                        <div className="se-history-icon" aria-hidden="true">
                          <Icon />
                        </div>
                        <div>
                          <div className="se-history-title">{item.title}</div>
                          <div className="se-history-date">Ready for API-backed records</div>
                        </div>
                        <div className="se-history-status active">Pending</div>
                        <div className="se-history-amount">--</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="se-history-list-card">
                <div className="se-section-heading se-section-heading--tight">
                  <div>
                    <h2>Active cards</h2>
                    <p>Balance, card state and delivery details will be real-time ready.</p>
                  </div>
                  <span className="se-section-heading-chip">Dashboard view</span>
                </div>
                <div className="se-active-card-stack">
                  <div className="se-active-mini-card">
                    <strong>Gift balance</strong>
                    <span>Show live wallet data after backend integration.</span>
                  </div>
                  <div className="se-active-mini-card">
                    <strong>Active cards</strong>
                    <span>Surface issued gift cards with template and amount.</span>
                  </div>
                  <div className="se-active-mini-card">
                    <strong>Offers</strong>
                    <span>Display special offers and seasonal promotions.</span>
                  </div>
                </div>
              </div>
            </section>

            {renderWorkspace()}
          </div>
        </div>
      </div>
    </>
  );
}

export default GiftCard;
