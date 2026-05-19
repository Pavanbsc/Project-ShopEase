import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import CategoryGrid from '../components/CategoryGrid';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import heroImage from '../assets/shop.jpg';
import recommendedImage from '../assets/recomend.jpg';
import topDealsImage from '../assets/top.jpg';
import megaImage from '../assets/mega.jpg';
import flashImage from '../assets/flash.jpg';
import extraImage from '../assets/extra.jpg';
import beautyImage from '../assets/beauty.jpg';
import sportsImage from '../assets/sports.jpg';
import blackImage from '../assets/black.jpg';

function UserHome() {
  useEffect(() => {
    const savedScrollY = Number(sessionStorage.getItem('shopease_home_scrollY') || 0);

    if (savedScrollY > 0) {
      const restore = () => window.scrollTo(0, savedScrollY);
      requestAnimationFrame(restore);
      window.setTimeout(restore, 0);
    }
  }, []);

  return (
    <div className="se-dashboard-page">
      <TopNavbar />

      <main className="se-main-content">
        <section className="se-hero-card">
          <div className="se-hero-jump-nav" aria-label="Quick section links">
            <a href="#shop-by-category" className="se-hero-jump-btn">
              Shop by Category
            </a>
            <a href="#shop-smart-save-more" className="se-hero-jump-btn">
              Shop Smart
            </a>
          </div>

          <div className="se-hero-visual" aria-hidden="true">
            <div className="se-hero-frame">
              <img src={heroImage} alt="ShopEase featured shopping banner" className="se-hero-image" />
            </div>
          </div>

          <div className="se-hero-copy">
            <span className="se-hero-badge">Premium Marketplace Experience</span>
            <h1>Discover smarter shopping in one elegant place</h1>
            <p>
              Explore trending products across every category with a smooth, modern, and highly
              curated shopping experience.
            </p>

            <div className="se-hero-actions">
              <Link to="/products" className="se-hero-link">
                Explore Products
              </Link>
              <span className="se-hero-note">Fresh deals • Fast browsing • Best selections</span>
            </div>
          </div>
        </section>

        <section id="shop-by-category" className="se-home-section">
          <div className="se-section-head se-pro-head">
            <div>
              <span className="se-pro-kicker">Discover</span>
              <h2 className="se-section-title">
                <span className="se-title-decor" aria-hidden="true" />
                Shop by Category
              </h2>
              <p>Browse curated categories to find what you need faster and smarter.</p>
            </div>
            <Link to="/products" className="se-section-link">
              View All
            </Link>
          </div>
          <CategoryGrid />
        </section>

        <section id="shop-smart-save-more" className="se-home-section">
          <div className="se-section-head se-pro-head">
            <div>
              <span className="se-pro-kicker">Exclusive Deals</span>
              <h2 className="se-section-title">
                <span className="se-title-decor" aria-hidden="true" />
                Shop Smart, Save More
              </h2>
              <p>Explore handpicked offers and top promotions across trending categories.</p>
            </div>
          </div>

          <div className="se-reco-row">
            <article className="se-reco-card se-feature-card">
              <div className="se-reco-media">
                <img
                  src={recommendedImage}
                  alt="Recommended products preview"
                  className="se-reco-image"
                />
                <div className="se-reco-overlay">
                  <h3>Recommended for You</h3>
                  <p>Discover products based on popular picks and current demand.</p>
                </div>
              </div>
            </article>

            <article className="se-reco-card se-feature-card">
              <div className="se-reco-media">
                <img src={topDealsImage} alt="Top deals preview" className="se-reco-image" />
                <div className="se-reco-overlay">
                  <h3>Top Deals</h3>
                  <p>Best prices refreshed daily across mobile, fashion, and lifestyle essentials.</p>
                </div>
              </div>
            </article>

            <article className="se-reco-card se-discount-card">
              <div className="se-reco-media">
                <img src={megaImage} alt="Mega Sale promotion" className="se-reco-image" />
                <div className="se-reco-overlay">
                  <div className="se-discount-badge">70% OFF</div>
                  <h3>Mega Sale</h3>
                  <p>Get up to 70% off on selected premium items and trending products.</p>
                </div>
              </div>
            </article>

            <article className="se-reco-card se-discount-card">
              <div className="se-reco-media">
                <img src={flashImage} alt="Flash Deals promotion" className="se-reco-image" />
                <div className="se-reco-overlay">
                  <div className="se-discount-badge">50% OFF</div>
                  <h3>Flash Deals</h3>
                  <p>Limited time 50% discount on fashion, electronics, and accessories.</p>
                </div>
              </div>
            </article>

            <article className="se-reco-card se-discount-card">
              <div className="se-reco-media">
                <img src={extraImage} alt="Extra Savings promotion" className="se-reco-image" />
                <div className="se-reco-overlay">
                  <div className="se-discount-badge">25% OFF</div>
                  <h3>Extra Savings</h3>
                  <p>Save 25% on all home and lifestyle products this week only.</p>
                </div>
              </div>
            </article>

            <article className="se-reco-card se-discount-card">
              <div className="se-reco-media">
                <img src={beautyImage} alt="Beauty and Wellness promotion" className="se-reco-image" />
                <div className="se-reco-overlay">
                  <div className="se-discount-badge">35% OFF</div>
                  <h3>Beauty & Wellness</h3>
                  <p>Up to 35% discount on skincare, cosmetics, and fitness products.</p>
                </div>
              </div>
            </article>

            <article className="se-reco-card se-discount-card">
              <div className="se-reco-media">
                <img src={sportsImage} alt="Sports and Outdoor promotion" className="se-reco-image" />
                <div className="se-reco-overlay">
                  <div className="se-discount-badge">45% OFF</div>
                  <h3>Sports & Outdoor</h3>
                  <p>Get 45% off on sports equipment, clothing, and outdoor gear.</p>
                </div>
              </div>
            </article>

            <article className="se-reco-card se-discount-card">
              <div className="se-reco-media">
                <img
                  src={blackImage}
                  alt="Black Friday Sale promotion"
                  className="se-reco-image"
                />
                <div className="se-reco-overlay">
                  <div className="se-discount-badge">60% OFF</div>
                  <h3>Black Friday Sale</h3>
                  <p>Massive 60% off on top brands, trending picks, and limited-time deals.</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <div className="se-main-content" style={{ paddingTop: '8px' }}>
        <FAQ />
      </div>

      <Footer />
    </div>
  );
}

export default UserHome;
