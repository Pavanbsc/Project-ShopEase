import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaChevronDown,
  FaCrown,
  FaGift,
  FaHeadset,
  FaHeart,
  FaPercent,
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaTags,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa';
import { getCartItems, getLoggedInUser, logoutUser } from '../services/api';
import Support from './Support';
import GiftCard from './GiftCard';
import Membership from './Membership';
import Rewards from './Rewards';

const quickItems = [
  { label: 'Wishlist', icon: FaHeart },
  { label: 'Rewards', icon: FaStar },
  { label: '24x7 Support', icon: FaHeadset },
  { label: 'Gift Card', icon: FaGift },
];

function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  const isProfilePage = location.pathname === '/profile';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [navShellHeight, setNavShellHeight] = useState(0);
  const [query, setQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const menuRef = useRef(null);
  const navShellRef = useRef(null);

  useEffect(() => {
    const syncCartCount = async () => {
      const user = getLoggedInUser();
      if (!user?.id) {
        setCartCount(0);
        return;
      }

      try {
        const items = await getCartItems();
        const count = items.reduce((accumulator, item) => accumulator + Number(item.quantity || 0), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    syncCartCount();
    window.addEventListener('storage', syncCartCount);
    window.addEventListener('cartUpdated', syncCartCount);
    window.addEventListener('authStateChanged', syncCartCount);

    return () => {
      window.removeEventListener('storage', syncCartCount);
      window.removeEventListener('cartUpdated', syncCartCount);
      window.removeEventListener('authStateChanged', syncCartCount);
    };
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!isHomePage) {
      setIsNavFixed(false);
      return undefined;
    }

    const handleScroll = () => {
      setIsNavFixed(window.scrollY > 120);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const updateNavHeight = () => {
      if (navShellRef.current) {
        setNavShellHeight(navShellRef.current.offsetHeight);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, [isNavFixed]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handleLogout = () => {
    logoutUser();
    // Dispatch custom event to notify App component
    window.dispatchEvent(new Event('authStateChanged'));
    setIsMenuOpen(false);
    navigate('/login');
  };

  const handleQuickItemClick = (label) => {
    if (label === 'Wishlist') {
      navigate('/wishlist');
      return;
    }

    if (label === 'Rewards') {
      setIsSupportOpen(false);
      setIsGiftCardOpen(false);
      setIsRewardsOpen(true);
    } else if (label === '24x7 Support') {
      setIsRewardsOpen(false);
      setIsGiftCardOpen(false);
      setIsSupportOpen(true);
    } else if (label === 'Gift Card') {
      setIsRewardsOpen(false);
      setIsSupportOpen(false);
      setIsGiftCardOpen(true);
    }
  };

  const handlePremiumClick = () => {
    setIsMembershipOpen(true);
  };

  return (
    <>
      <header className="se-navbar-wrap">
        <div className="se-brand-strip">
          <Link to="/home" className="se-brand-title" aria-label="ShopEase home">
            <span className="se-brand-copy">
              <strong>ShopEase</strong>
              <small>Premium shopping made effortless</small>
            </span>
          </Link>
          <p className="se-brand-quote">Shop smarter, live better — discover everyday value in style.</p>
        </div>
      </header>

      {!isProfilePage && isHomePage && isNavFixed ? (
        <div className="se-home-nav-shell-placeholder" style={{ height: `${navShellHeight}px` }} />
      ) : null}

      {!isProfilePage ? (
        <div ref={navShellRef} className={`se-home-nav-shell ${isHomePage && isNavFixed ? 'is-fixed' : ''}`}>
          <nav className="se-navbar" aria-label="ShopEase primary navigation">
            <Link to="/home" className="se-home-chip" aria-label="Go to home">
              Home
            </Link>

            <form className="se-search" onSubmit={handleSearchSubmit}>
              <FaSearch className="se-search-icon" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for products, brands and more"
                aria-label="Search products"
              />
            </form>

            <div className="se-nav-right">
              <button
                type="button"
                className="se-notif-btn"
                onClick={() => setIsNotifOpen((previous) => !previous)}
                aria-label="Notifications"
              >
                <span className="se-action-icon" aria-hidden="true">
                  <FaBell />
                </span>
                {notifCount > 0 && <strong className="se-notif-badge">{notifCount}</strong>}
              </button>

              <Link to="/cart" className="se-cart-btn" aria-label="Open cart">
                <span className="se-action-icon" aria-hidden="true">
                  <FaShoppingCart />
                </span>
                <span className="se-action-label">Cart</span>
                <strong className="se-cart-badge">{cartCount}</strong>
              </Link>

              <div className="se-profile" ref={menuRef}>
                <button
                  type="button"
                  className="se-profile-btn"
                  onClick={() => setIsMenuOpen((previous) => !previous)}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="se-action-icon" aria-hidden="true">
                    <FaUserCircle />
                  </span>
                  <span className="se-action-label">Profile</span>
                  <FaChevronDown className={`se-caret ${isMenuOpen ? 'open' : ''}`} />
                </button>

                {isMenuOpen ? (
                  <div className="se-profile-menu" role="menu">
                    <Link to="/profile" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/orders" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                      Orders
                    </Link>
                    <button type="button" role="menuitem" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </nav>
        </div>
      ) : null}

      {isHomePage ? (
        <div className="se-quick-row">
          <div className="se-quick-strip" aria-label="ShopEase quick actions">
            {quickItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="se-quick-chip"
                onClick={() => handleQuickItemClick(label)}
              >
                <span className="se-quick-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span>{label}</span>
              </button>
            ))}
            <button
              type="button"
              className="se-premium-chip"
              onClick={handlePremiumClick}
              aria-label="ShopEase Premium membership"
            >
              <span className="se-premium-icon" aria-hidden="true">
                <FaCrown />
              </span>
              <span className="se-premium-label">ShopEase Premium</span>
            </button>
          </div>
        </div>
      ) : null}

      {isMembershipOpen && (
        <Membership isOpen={isMembershipOpen} onClose={() => setIsMembershipOpen(false)} />
      )}

      {isRewardsOpen && (
        <Rewards isOpen={isRewardsOpen} onClose={() => setIsRewardsOpen(false)} />
      )}

      {isSupportOpen && (
        <Support onClose={() => setIsSupportOpen(false)} />
      )}

      {isGiftCardOpen && (
        <GiftCard isOpen={isGiftCardOpen} onClose={() => setIsGiftCardOpen(false)} />
      )}
    </>
  );
}

export default TopNavbar;
