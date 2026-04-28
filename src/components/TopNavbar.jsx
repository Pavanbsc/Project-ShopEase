import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaChevronDown,
  FaGift,
  FaHeadset,
  FaHeart,
  FaPercent,
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaTags,
  FaUserCircle,
} from 'react-icons/fa';
import { logoutUser } from '../services/api';

const quickItems = [
  { label: 'Wishlist', icon: FaHeart },
  { label: 'Rewards', icon: FaStar },
  { label: '24x7 Support', icon: FaHeadset },
  { label: 'Gift Card', icon: FaGift },
  { label: 'Offers', icon: FaPercent },
  { label: 'Deals', icon: FaTags },
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
  const menuRef = useRef(null);
  const navShellRef = useRef(null);

  useEffect(() => {
    const storedCount = Number(window.localStorage.getItem('shopease_cart_count') || 0);
    if (!Number.isNaN(storedCount)) {
      setCartCount(storedCount);
    }
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
                    <button type="button" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                      Orders
                    </button>
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
              <button key={label} type="button" className="se-quick-chip">
                <span className="se-quick-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default TopNavbar;
