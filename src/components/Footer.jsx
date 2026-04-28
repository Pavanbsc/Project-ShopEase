import { Link } from 'react-router-dom';
import {
  FaApple,
  FaArrowRight,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaEnvelope,
  FaGooglePlay,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaTwitter,
  FaTruck,
  FaYoutube,
} from 'react-icons/fa';

const quickLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Products', to: '/products' },
  { label: 'Cart', to: '/cart' },
  { label: 'Profile', to: '/profile' },
];

const customerCare = [
  'Help Center',
  'Track Order',
  'Returns & Refunds',
  'Shipping Info',
];

const policies = [
  'Privacy Policy',
  'Terms of Use',
  'Cookie Policy',
  'Cancellation Policy',
];

const socialLinks = [
  { label: 'Instagram', icon: FaInstagram },
  { label: 'Twitter', icon: FaTwitter },
  { label: 'YouTube', icon: FaYoutube },
];

function Footer() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <footer className="se-footer">
      <div className="se-footer-shell">
        <div className="se-footer-top">
          <section className="se-footer-brand">
            <div className="se-footer-logo">ShopEase</div>
            <p>
              A premium shopping experience built for fast browsing, trusted service, and better
              everyday value.
            </p>

            <div className="se-footer-contact">
              <div>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
              <div>
                <FaPhoneAlt aria-hidden="true" />
                <span>+91 98765 43210</span>
              </div>
              <div>
                <FaEnvelope aria-hidden="true" />
                <span>support@shopease.com</span>
              </div>
            </div>
          </section>

          <section className="se-footer-col">
            <h3>Quick Links</h3>
            <ul>
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <FaArrowRight aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="se-footer-col">
            <h3>Customer Support</h3>
            <ul>
              {customerCare.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </section>

          <section className="se-footer-col">
            <h3>Policies</h3>
            <ul>
              {policies.map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </section>

          <section className="se-footer-newsletter">
            <h3>Newsletter</h3>
            <p>Subscribe for early access to deals, launches, and seasonal offers.</p>
            <form className="se-footer-subscribe" onSubmit={handleSubmit}>
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button type="submit">Subscribe</button>
            </form>

            <div className="se-footer-apps">
              <div className="se-footer-app-btn">
                <FaApple aria-hidden="true" />
                <div>
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </div>
              <div className="se-footer-app-btn">
                <FaGooglePlay aria-hidden="true" />
                <div>
                  <span>Get it on</span>
                  <strong>Google Play</strong>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="se-footer-middle">
          <div className="se-footer-badges">
            <span>
              <FaShieldAlt aria-hidden="true" /> Secure Payments
            </span>
            <span>
              <FaTruck aria-hidden="true" /> Fast Delivery
            </span>
            <span>
              <FaShieldAlt aria-hidden="true" /> Trusted Support
            </span>
          </div>

          <div className="se-footer-payments" aria-label="Payment methods">
            <FaCcVisa aria-hidden="true" />
            <FaCcMastercard aria-hidden="true" />
            <FaCcPaypal aria-hidden="true" />
            <span className="se-footer-wallet">UPI</span>
          </div>
        </div>

        <div className="se-footer-bottom">
          <p>© 2026 ShopEase. All rights reserved.</p>
          <div className="se-footer-social" aria-label="Social links">
            {socialLinks.map(({ label, icon: Icon }) => (
              <a key={label} href="#" aria-label={label}>
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
