import { useState } from 'react';
import {
  FaBolt,
  FaCrown,
  FaGem,
  FaGift,
  FaLock,
  FaMapMarkerAlt,
  FaMedal,
  FaPercent,
  FaRegCircle,
  FaRocket,
  FaShoppingBag,
  FaStar,
  FaTrophy,
  FaTimes,
  FaUsers,
  FaArrowUp,
  FaFire,
  FaHeart,
  FaCheck,
} from 'react-icons/fa';

const membershipTiers = [
  {
    id: 'silver',
    name: 'Silver',
    color: '#C0C0C0',
    hexColor: 'rgb(192, 192, 192)',
    pointsRequired: 0,
    description: 'Entry level member',
    benefits: ['5% cashback', 'Free shipping on orders >500'],
  },
  {
    id: 'gold',
    name: 'Gold',
    color: '#FFD700',
    hexColor: 'rgb(255, 215, 0)',
    pointsRequired: 5000,
    description: 'Regular shopper',
    benefits: ['8% cashback', 'Free shipping on all orders', 'Birthday bonus'],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    color: '#E5E4E2',
    hexColor: 'rgb(229, 228, 226)',
    pointsRequired: 15000,
    description: 'Devoted customer',
    benefits: ['12% cashback', 'Priority support', 'Exclusive deals', 'Double points events'],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    color: '#0369A1',
    hexColor: 'rgb(3, 105, 161)',
    pointsRequired: 30000,
    description: 'VIP member',
    benefits: ['15% cashback', 'Concierge support', 'VIP sale access', 'Triple points on weekends'],
  },
];

const earningWays = [
  {
    id: 'shopping',
    title: 'Shopping',
    description: 'Earn points on every purchase',
    points: '1 point per ₹1 spent',
    icon: FaShoppingBag,
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boost: '2x on weekends',
    boostIcon: FaFire,
  },
  {
    id: 'referral',
    title: 'Referral Program',
    description: 'Invite friends and earn',
    points: '500 points per referral',
    icon: FaUsers,
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    boost: 'Unlimited referrals',
    boostIcon: FaArrowUp,
  },
  {
    id: 'special',
    title: 'Special Offers',
    description: 'Participate in campaigns',
    points: 'Bonus points on events',
    icon: FaBolt,
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    boost: 'Flash deals daily',
    boostIcon: FaStar,
  },
];

const redeemOptions = [
  {
    id: 'discount',
    title: 'Instant Discounts',
    description: 'Apply to your next purchase',
    minPoints: 1000,
    value: '₹100 off',
    icon: FaPercent,
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'coupon',
    title: 'Exclusive Coupons',
    description: 'Premium shopping coupons',
    minPoints: 2000,
    value: 'Custom coupons',
    icon: FaGift,
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'giftcard',
    title: 'Gift Cards',
    description: 'Digital gift cards for you or friends',
    minPoints: 3000,
    value: '₹300+ cards',
    icon: FaHeart,
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
];

const journeySteps = [
  {
    id: 'starter',
    title: 'Starter',
    activity: 'Complete 1st order',
    reward: 'Welcome perk unlocked',
    status: 'completed',
    icon: FaShoppingBag,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    activity: 'Shop & engage weekly',
    reward: 'Early drop access',
    status: 'current',
    icon: FaRocket,
  },
  {
    id: 'insider',
    title: 'Insider',
    activity: 'Refer 2 friends',
    reward: 'Premium coupons',
    status: 'upcoming',
    icon: FaGem,
  },
  {
    id: 'legend',
    title: 'Legend',
    activity: 'Consistency streak',
    reward: 'VIP loyalty benefits',
    status: 'upcoming',
    icon: FaCrown,
  },
];

const recentHistory = [
  {
    id: 'h1',
    type: 'earned',
    title: 'Shopping - Order #12345',
    points: '+250 points',
    date: '2 hours ago',
    icon: FaCheck,
  },
  {
    id: 'h2',
    type: 'redeemed',
    title: 'Redeemed for ₹100 discount',
    points: '-1000 points',
    date: '1 day ago',
    icon: FaCheck,
  },
  {
    id: 'h3',
    type: 'earned',
    title: 'Referral bonus - Friend signup',
    points: '+500 points',
    date: '3 days ago',
    icon: FaCheck,
  },
  {
    id: 'h4',
    type: 'earned',
    title: 'Birthday Special Bonus',
    points: '+1000 points',
    date: '1 week ago',
    icon: FaCheck,
  },
];

function Rewards({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTier, setSelectedTier] = useState('gold');

  if (!isOpen) {
    return null;
  }

  // Mock data (backend-ready placeholders)
  const currentPoints = 8750;
  const totalPoints = 18500;
  const availableBalance = 875; // ₹
  const currentTierIndex = 1; // Gold tier
  const progressToNextTier = 75; // Percentage
  const userTierName = membershipTiers[currentTierIndex].name;

  return (
    <>
      <div className="se-rewards-backdrop" onClick={onClose} />

      <div className="se-rewards-modal" role="dialog" aria-modal="true" aria-labelledby="rewards-title">
        {/* Header */}
        <div className="se-rewards-header">
          <div className="se-rewards-title-section">
            <div className="se-rewards-badge">
              <FaStar className="se-rewards-badge-icon" />
            </div>
            <div>
              <div className="se-rewards-kicker">Loyalty & Rewards</div>
              <h1 id="rewards-title">ShopEase Rewards</h1>
              <p>Earn points, unlock benefits, and enjoy exclusive perks</p>
            </div>
          </div>
          <button type="button" className="se-rewards-close" onClick={onClose} aria-label="Close rewards">
            <FaTimes />
          </button>
        </div>

        {/* Main Content */}
        <div className="se-rewards-content">
          {/* Premium Points Display */}
          <div className="se-rewards-premium-header">
            <div className="se-rewards-points-card">
              <div className="se-rewards-points-label">Your Rewards Balance</div>
              <div className="se-rewards-points-display">
                <span className="se-rewards-points-value">{currentPoints.toLocaleString()}</span>
                <span className="se-rewards-points-unit">Points</span>
              </div>
              <p className="se-rewards-points-note">Available as ₹{availableBalance} cash value</p>

              {/* Tier Progress */}
              <div className="se-rewards-tier-progress-section">
                <div className="se-rewards-tier-current">
                  <span className="se-rewards-current-tier-label">Current Tier</span>
                  <div className="se-rewards-tier-badge" style={{
                    background: membershipTiers[currentTierIndex].hexColor,
                    color: currentTierIndex >= 2 ? '#fff' : '#000'
                  }}>
                    <FaCrown /> {userTierName}
                  </div>
                </div>

                <div className="se-rewards-progress-to-next">
                  <div className="se-rewards-progress-header">
                    <span className="se-rewards-progress-label">Progress to {membershipTiers[currentTierIndex + 1]?.name || 'top tier'}</span>
                    <span className="se-rewards-progress-percent">{progressToNextTier}%</span>
                  </div>
                  <div className="se-rewards-progress-track-large">
                    <div className="se-rewards-progress-fill-animated" style={{ width: `${progressToNextTier}%` }} />
                  </div>
                  <p className="se-rewards-progress-note">{currentTierIndex + 1 < membershipTiers.length ? `${membershipTiers[currentTierIndex + 1].pointsRequired - totalPoints} more points needed` : 'You have reached the top tier!'}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="se-rewards-quick-stats">
              <div className="se-rewards-stat-item">
                <div className="se-rewards-stat-icon"><FaShoppingBag /></div>
                <span className="se-rewards-stat-label">Lifetime Spent</span>
                <strong>₹87,500</strong>
              </div>
              <div className="se-rewards-stat-item">
                <div className="se-rewards-stat-icon"><FaUsers /></div>
                <span className="se-rewards-stat-label">Friends Referred</span>
                <strong>5</strong>
              </div>
              <div className="se-rewards-stat-item">
                <div className="se-rewards-stat-icon"><FaTrophy /></div>
                <span className="se-rewards-stat-label">Member Since</span>
                <strong>18 months</strong>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="se-rewards-tab-navigation">
            <button
              className={`se-rewards-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaStar /> Overview
            </button>
            <button
              className={`se-rewards-tab-btn ${activeTab === 'earning' ? 'active' : ''}`}
              onClick={() => setActiveTab('earning')}
            >
              <FaArrowUp /> Earning
            </button>
            <button
              className={`se-rewards-tab-btn ${activeTab === 'redeem' ? 'active' : ''}`}
              onClick={() => setActiveTab('redeem')}
            >
              <FaGift /> Redeem
            </button>
            <button
              className={`se-rewards-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <FaCheck /> History
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="se-rewards-tab-content">
              {/* Membership Tiers */}
              <section className="se-rewards-section">
                <h2 className="se-rewards-section-title">Membership Tiers</h2>
                <div className="se-rewards-tiers-grid">
                  {membershipTiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className={`se-rewards-tier-card ${idx === currentTierIndex ? 'active' : ''} ${idx < currentTierIndex ? 'unlocked' : 'locked'}`}
                      onClick={() => setSelectedTier(tier.id)}
                      style={{
                        borderColor: idx <= currentTierIndex ? tier.hexColor : 'rgba(189, 209, 235, 0.35)',
                      }}
                    >
                      <div className="se-rewards-tier-icon" style={{ background: `${tier.hexColor}20` }}>
                        <FaCrown style={{ color: tier.hexColor }} />
                      </div>
                      <h3>{tier.name}</h3>
                      <p className="se-rewards-tier-desc">{tier.description}</p>
                      {tier.pointsRequired > 0 && <p className="se-rewards-tier-points">{tier.pointsRequired.toLocaleString()} points</p>}
                      <div className="se-rewards-tier-benefits">
                        {tier.benefits.map((benefit, i) => (
                          <span key={i}><FaCheck /> {benefit}</span>
                        ))}
                      </div>
                      {idx === currentTierIndex && <div className="se-rewards-tier-badge-current">Current</div>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Journey Path */}
              <section className="se-rewards-section">
                <h2 className="se-rewards-section-title">Your Journey</h2>
                <div className="se-rewards-journey-grid">
                  {journeySteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    return (
                      <div key={step.id} className={`se-rewards-journey-card ${step.status}`}>
                        <div className="se-rewards-journey-order">{index + 1}</div>
                        <Icon className="se-rewards-journey-icon" />
                        <h3>{step.title}</h3>
                        <p className="se-rewards-journey-activity">{step.activity}</p>
                        <span className="se-rewards-journey-state">
                          {isCompleted ? <FaCheck /> : isCurrent ? <FaMedal /> : <FaLock />}
                          {isCompleted ? 'Unlocked' : isCurrent ? 'In Progress' : 'Locked'}
                        </span>
                        <strong>{step.reward}</strong>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* Earning Tab */}
          {activeTab === 'earning' && (
            <div className="se-rewards-tab-content">
              <section className="se-rewards-section">
                <h2 className="se-rewards-section-title">Ways to Earn Points</h2>
                <p className="se-rewards-section-desc">Explore all the ways you can accumulate rewards</p>

                <div className="se-rewards-earning-grid">
                  {earningWays.map((way) => {
                    const Icon = way.icon;
                    const BoostIcon = way.boostIcon;
                    return (
                      <div key={way.id} className="se-rewards-earning-card">
                        <div className="se-rewards-earning-header" style={{ background: way.bgGradient }}>
                          <Icon className="se-rewards-earning-icon" />
                        </div>
                        <div className="se-rewards-earning-body">
                          <h3>{way.title}</h3>
                          <p className="se-rewards-earning-desc">{way.description}</p>
                          <div className="se-rewards-earning-points">
                            <FaStar /> {way.points}
                          </div>
                          <div className="se-rewards-earning-boost">
                            <BoostIcon className="se-rewards-boost-icon" />
                            <span>{way.boost}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="se-rewards-earning-tips">
                  <h3>💡 Pro Tips to Maximize Rewards</h3>
                  <ul>
                    <li>2x points on weekends - Perfect time to shop!</li>
                    <li>Triple points during special festivals and events</li>
                    <li>Refer 5 friends and get a tier boost</li>
                    <li>Birthday month gives double the usual points</li>
                    <li>Platinum+ members get surprise bonuses</li>
                  </ul>
                </div>
              </section>
            </div>
          )}

          {/* Redeem Tab */}
          {activeTab === 'redeem' && (
            <div className="se-rewards-tab-content">
              <section className="se-rewards-section">
                <h2 className="se-rewards-section-title">Redeem Your Points</h2>
                <p className="se-rewards-section-desc">You have {currentPoints.toLocaleString()} points available to redeem</p>

                <div className="se-rewards-redeem-grid">
                  {redeemOptions.map((option) => {
                    const Icon = option.icon;
                    const canRedeem = currentPoints >= option.minPoints;
                    return (
                      <div key={option.id} className={`se-rewards-redeem-card ${canRedeem ? 'available' : 'locked'}`}>
                        <div className="se-rewards-redeem-header" style={{ background: option.bgGradient }}>
                          <Icon className="se-rewards-redeem-icon" />
                        </div>
                        <div className="se-rewards-redeem-body">
                          <h3>{option.title}</h3>
                          <p className="se-rewards-redeem-desc">{option.description}</p>
                          <div className="se-rewards-redeem-value">{option.value}</div>
                          <p className="se-rewards-redeem-cost">Requires {option.minPoints.toLocaleString()} points</p>
                          <button className={`se-rewards-redeem-btn ${canRedeem ? 'enabled' : 'disabled'}`} disabled={!canRedeem}>
                            {canRedeem ? 'Redeem Now' : 'Not Enough Points'}
                          </button>
                        </div>
                        {!canRedeem && <div className="se-rewards-redeem-overlay"><FaLock /> Locked</div>}
                      </div>
                    );
                  })}
                </div>

                <div className="se-rewards-redeem-info">
                  <h3>✨ Premium Member Perks</h3>
                  <div className="se-rewards-redeem-perks-list">
                    <div className="se-rewards-perk-item">
                      <FaStar /> Platinum members get 15% bonus redemption value
                    </div>
                    <div className="se-rewards-perk-item">
                      <FaStar /> Diamond members get exclusive gift cards worth up to ₹500
                    </div>
                    <div className="se-rewards-perk-item">
                      <FaStar /> Earn-while-you-redeem: Get 1% points back on every redemption
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="se-rewards-tab-content">
              <section className="se-rewards-section">
                <h2 className="se-rewards-section-title">Reward History</h2>
                <p className="se-rewards-section-desc">Track all your points earned and redeemed</p>

                <div className="se-rewards-history-timeline">
                  {recentHistory.map((item, idx) => {
                    const Icon = item.icon;
                    const isEarned = item.type === 'earned';
                    return (
                      <div key={item.id} className={`se-rewards-history-item ${item.type}`}>
                        <div className="se-rewards-history-marker">
                          <Icon className="se-rewards-history-icon" style={{
                            color: isEarned ? '#16a34a' : '#dc2626'
                          }} />
                        </div>
                        <div className="se-rewards-history-content">
                          <h4>{item.title}</h4>
                          <p className="se-rewards-history-date">{item.date}</p>
                        </div>
                        <div className={`se-rewards-history-points ${item.type}`}>
                          {item.points}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="se-rewards-history-summary">
                  <div className="se-rewards-summary-card">
                    <span className="se-rewards-summary-label">Total Earned (This Month)</span>
                    <strong className="se-rewards-summary-earned">+1,250 points</strong>
                  </div>
                  <div className="se-rewards-summary-card">
                    <span className="se-rewards-summary-label">Total Redeemed (This Month)</span>
                    <strong className="se-rewards-summary-redeemed">-1,000 points</strong>
                  </div>
                  <div className="se-rewards-summary-card">
                    <span className="se-rewards-summary-label">Net this Month</span>
                    <strong className="se-rewards-summary-net">+250 points</strong>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Rewards;
