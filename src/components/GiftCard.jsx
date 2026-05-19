import React, { useState, useMemo } from 'react';
import {
  FaGift,
  FaTimes,
  FaArrowRight,
  FaQrcode,
  FaHistory,
  FaHeart,
  FaTag,
  FaUser,
  FaEnvelope,
  FaCopy,
  FaCheck,
  FaBirthdayCake,
  FaStar,
  FaAward,
  FaUsers,
  FaTrophy,
} from 'react-icons/fa';

const GiftCard = ({ onClose }) => {
  const [activeMode, setActiveMode] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    message: '',
    redeemCode: '',
  });

  const actionTiles = [
    { id: 'send', title: 'Send', desc: 'Send a gift', icon: FaEnvelope, tone: 'blue' },
    { id: 'buy', title: 'Buy', desc: 'Purchase for yourself', icon: FaTrophy, tone: 'violet' },
    { id: 'redeem', title: 'Redeem', desc: 'Redeem a code', icon: FaQrcode, tone: 'green' },
    { id: 'history', title: 'History', desc: 'Transaction history', icon: FaHistory, tone: 'gray' },
  ];

  const suggestionCards = [
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
      icon: FaStar,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      tagline: 'Sustainable gifting for conscious shoppers',
    },
  ];

  const walletCards = [
    {
      title: 'Active Balance',
      value: '₹0',
      icon: FaHeart,
      note: 'Funds ready to gift—recharge anytime',
    },
    {
      title: 'Pending Gifts',
      value: '0',
      icon: FaUser,
      note: 'Waiting for friends to accept',
    },
    {
      title: 'Redeemed',
      value: '0',
      icon: FaCheck,
      note: 'Successful gift redemptions',
    },
  ];

  const historyPlaceholders = [
    {
      title: 'Sent a gift to Arjun',
      icon: FaArrowRight,
      time: '2 hours ago',
    },
    {
      title: 'Received ₹500 gift card',
      icon: FaGift,
      time: '5 days ago',
    },
    {
      title: 'Redeemed code SAVEMORE25',
      icon: FaQrcode,
      time: '1 week ago',
    },
  ];

  const renderWorkspace = () => {
    const commonHeader = (
      <div className="se-workspace-header modern">
        <div>
          <span className="se-workspace-kicker">{activeMode === 'buy' ? 'Buy Gift' : activeMode === 'send' ? 'Send Gift' : activeMode === 'redeem' ? 'Redeem' : 'History'}</span>
          <h3 className="se-workspace-title">{activeMode === 'buy' ? 'Buy a beautiful gift card' : activeMode === 'send' ? 'Send a personalised gift' : activeMode === 'redeem' ? 'Redeem your gift code' : 'Your gift activity'}</h3>
        </div>
        <button type="button" className="se-workspace-close modern" onClick={() => setActiveMode('dashboard')} aria-label="Back to dashboard"><FaTimes /></button>
      </div>
    );

    // SEND / BUY view - modern 2-column layout with live preview
    if (activeMode === 'send' || activeMode === 'buy') {
      const isBuy = activeMode === 'buy';
      const amounts = [250, 500, 1000, 2000, 5000];
      return (
        <section className="se-gift-modal">
          {commonHeader}
          <div className="se-gift-modal-inner">
            <div className="se-gift-left">
              <div className="se-panel se-design-panel">
                <div className="se-section-top">
                  <div>
                    <div className="se-section-kicker">Design</div>
                    <h3 className="se-section-title">Choose a gift card style</h3>
                    <p className="se-section-subtitle">
                      Select a premium template for a more polished gift experience.
                    </p>
                  </div>
                  <span className="se-section-chip">5 styles</span>
                </div>

                <div className="se-template-grid-modern">
                  {suggestionCards.slice(0, 5).map((card) => {
                    const Icon = card.icon;
                    const selected = formData.template === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        className={`se-template-modern ${selected ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, template: card.id })}
                        aria-pressed={selected}
                      >
                        <div className="se-template-modern-icon"><Icon /></div>
                        <div className="se-template-modern-body">
                          <strong>{card.label}</strong>
                          <span className="muted">{card.tagline}</span>
                        </div>
                        {selected && <div className="se-template-check">✓</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="se-form-grid">
                <div className="se-panel se-panel-compact">
                  <label className="se-label">Amount</label>
                  <div className="se-amount-chips">
                    {amounts.map((a) => (
                      <button
                        key={a}
                        type="button"
                        className={`se-chip ${formData.amount == a ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, amount: a })}
                      >
                        <span className="se-chip-value">₹{a.toLocaleString()}</span>
                      </button>
                    ))}
                    <input
                      className="se-chip se-chip-custom"
                      type="number"
                      min="1"
                      placeholder="Custom amount"
                      value={formData.amount && !amounts.includes(Number(formData.amount)) ? formData.amount : ''}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="se-panel se-panel-compact">
                  <label className="se-label" htmlFor="recipient">Recipient</label>
                  <input
                    id="recipient"
                    className="se-input"
                    type="text"
                    placeholder="Name or email"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  />
                </div>

                <div className="se-panel se-message-panel">
                  <label className="se-label">Message (optional)</label>
                  <textarea
                    className="se-textarea"
                    placeholder="Write a short message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="se-actions-row">
                  <button className="se-btn se-btn-primary" onClick={() => alert(isBuy ? 'Buying...' : 'Sending...')}>{isBuy ? 'Buy & Add to Wallet' : 'Send Gift'}</button>
                  <button className="se-btn se-btn-ghost" onClick={() => setActiveMode('dashboard')}>Cancel</button>
                </div>
              </div>
            </div>

            <aside className="se-gift-right">
              <div className="se-preview-panel">
                <div className="se-preview-topline">Preview</div>
                <div className="se-preview-card" style={{ backgroundImage: suggestionCards.find(s => s.id === formData.template)?.gradient || suggestionCards[0].gradient }}>
                  <div className="se-preview-inner">
                    <div className="se-preview-left">
                      <div className="se-preview-label">Gift</div>
                      <div className="se-preview-amount">{formData.amount ? `₹${formData.amount}` : '—'}</div>
                    </div>
                    <div className="se-preview-right">
                      <div className="se-preview-message">{formData.message || 'A special gift for you'}</div>
                      <div className="se-preview-recipient">To: {formData.recipient || 'Recipient'}</div>
                    </div>
                  </div>
                </div>

                <div className="se-purchase-summary">
                  <div>
                    <strong>Summary</strong>
                    <div className="muted">{isBuy ? 'Buying for yourself' : 'Sending to recipient'}</div>
                  </div>
                  <div className="se-summary-amount">{formData.amount ? `₹${formData.amount}` : '—'}</div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      );
    }

    // REDEEM view - minimal centered
    if (activeMode === 'redeem') {
      return (
        <section className="se-redeem-modal">
          {commonHeader}
          <div className="se-redeem-card">
            <label className="se-label">Enter gift code</label>
            <input className="se-input large" placeholder="GIFT-XXXX-YYYY" value={formData.redeemCode} onChange={(e) => setFormData({ ...formData, redeemCode: e.target.value.toUpperCase() })} />
            <div className="se-redeem-actions">
              <button className="se-btn se-btn-primary" onClick={() => alert('Redeem requested')}>Redeem</button>
              <button className="se-btn se-btn-ghost" onClick={() => setActiveMode('dashboard')}>Cancel</button>
            </div>
          </div>
        </section>
      );
    }

    // HISTORY fallback - keep simple list
    if (activeMode === 'history') {
      return (
        <section className="se-giftcard-workspace">
          {commonHeader}
          <div className="se-workspace-card">
            <div className="se-history-list">
              {historyPlaceholders.map((h, i) => (
                <div key={i} className="se-history-row">
                  <div className="se-history-icon"><h.icon /></div>
                  <div className="se-history-content">
                    <div className="se-history-title">{h.title}</div>
                    <div className="se-history-time muted">{h.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <>
      <div
        className="se-giftcard-backdrop"
        onClick={activeMode === 'dashboard' ? onClose : undefined}
      />

      {activeMode === 'dashboard' ? (
        <div
          className="se-giftcard-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="giftcard-title"
        >
          <div className="se-giftcard-header">
            <div className="se-giftcard-header-content">
              <div className="se-giftcard-title-icon" aria-hidden="true">
                <FaGift />
              </div>
              <div>
                <h1 id="giftcard-title">ShopEase Gift Cards</h1>
                <p>
                  Wallet & Gifts dashboard with premium actions and live-ready
                  data slots
                </p>
              </div>
            </div>

            <button
              type="button"
              className="se-giftcard-close"
              onClick={onClose}
              aria-label="Close gift card dialog"
            >
              <FaTimes />
            </button>
          </div>

          <div className="se-giftcard-content">
            <div className="se-giftcard-dashboard-shell">
              {/* Quick Actions header removed - only action tiles shown below */}

              <section className="se-giftcard-actions-strip">
                {actionTiles.map((item) => {
                  const Icon = item.icon;
                  const active = activeMode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`se-action-tile tone-${item.tone} ${
                        active ? 'active' : ''
                      }`}
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

              <section className="se-giftcard-template-area se-template-showcase">
                <div className="se-section-heading se-template-heading">
                  <div className="se-heading-content">
                    <h2>Choose Your Gift Card Style</h2>
                    <p>
                      Select a premium template for your gift card. Each design is carefully 
                      crafted for different occasions and celebrations.
                    </p>
                  </div>
                  <span className="se-section-heading-chip se-chip-badge">5 Designs</span>
                </div>

                <div className="se-template-grid-showcase">
                  {suggestionCards.map((card) => {
                    const Icon = card.icon;
                    const isSelected = selectedTemplate === card.id;
                    return (
                      <div
                        key={card.id}
                        className={`se-template-card-horizontal ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedTemplate(card.id)}
                      >
                        <div className="se-template-card-icon-box">
                          <Icon className="se-template-card-icon" />
                        </div>
                        <div className="se-template-card-text">
                          <h3>{card.label}</h3>
                          <p>{card.tagline}</p>
                        </div>
                        {isSelected && (
                          <div className="se-template-card-checkmark">
                            <FaCheck />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="se-giftcard-activity-grid">
                <div className="se-history-list-card">
                  <div className="se-section-heading se-section-heading--tight">
                    <div>
                      <h2>Recent activity</h2>
                      <p>
                        All backend events can be streamed here in a clean
                        timeline.
                      </p>
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
                            <div className="se-history-title">
                              {item.title}
                            </div>
                            <div className="se-history-date">
                              Ready for API-backed records
                            </div>
                          </div>
                          <div className="se-history-status active">
                            Pending
                          </div>
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
                      <p>
                        Balance, card state and delivery details will be
                        real-time ready.
                      </p>
                    </div>
                    <span className="se-section-heading-chip">
                      Dashboard view
                    </span>
                  </div>
                  <div className="se-active-card-stack">
                    <div className="se-active-mini-card">
                      <strong>Gift balance</strong>
                      <span>Show live wallet data after backend integration.</span>
                    </div>
                    <div className="se-active-mini-card">
                      <strong>Active cards</strong>
                      <span>
                        Surface issued gift cards with template and amount.
                      </span>
                    </div>
                    <div className="se-active-mini-card">
                      <strong>Offers</strong>
                      <span>
                        Display special offers and seasonal promotions.
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="se-giftcard-workspace-modal"
          role="dialog"
          aria-modal="true"
        >
          {renderWorkspace()}
        </div>
      )}
    </>
  );
};

export default GiftCard;
