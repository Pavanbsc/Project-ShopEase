import { Link } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import CategoryCard from '../components/home/CategoryCard';
import { homeCategories } from '../components/home/homeCategories';
import '../styles/home.css';

function UserHome() {
  return (
    <div className="home-screen">
      <TopNavbar />

      <main className="home-screen__content">
        <section className="home-hero" aria-labelledby="home-hero-title">
          <div className="home-hero__inner">
            <div>
              <span className="home-hero__eyebrow">ShopEase Marketplace</span>
              <h1 id="home-hero-title">A cleaner way to shop by category</h1>
              <p>
                Explore curated categories, expand subcategories instantly, and move from browsing
                to buying with a mobile-first experience built for speed and clarity.
              </p>

              <div className="home-hero__actions">
                <Link to="/products" className="home-hero__button">
                  Browse Products
                </Link>
                <Link to="/profile" className="home-hero__ghost">
                  View Account
                </Link>
              </div>
            </div>

            <div className="home-hero__stats" aria-label="ShopEase highlights">
              <div className="home-hero__stat">
                <strong>14</strong>
                <span>Main categories</span>
              </div>
              <div className="home-hero__stat">
                <strong>Mobile</strong>
                <span>First design</span>
              </div>
              <div className="home-hero__stat">
                <strong>Fast</strong>
                <span>Expandable browsing</span>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section" aria-labelledby="browse-categories-title">
          <div className="home-section__header">
            <div>
              <span className="home-section__eyebrow">Browse</span>
              <h2 id="browse-categories-title">Shop by category</h2>
              <p>Tap a card to expand subcategories, or open a category with no subcategories directly.</p>
            </div>
            <Link to="/products" className="home-hero__ghost">
              See all products
            </Link>
          </div>

          <div className="home-category-grid">
            {homeCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="home-section" aria-labelledby="quick-value-title">
          <div className="home-section__header">
            <div>
              <span className="home-section__eyebrow">Experience</span>
              <h2 id="quick-value-title">Built for modern shopping</h2>
              <p>Clear hierarchy, clean cards, and a layout that scales well from phones to desktops.</p>
            </div>
          </div>

          <div className="home-category-feature-grid">
            <article className="home-feature-card">
              <strong>Expandable categories</strong>
              <p>Open each category to reveal nested subcategories without cluttering the screen.</p>
            </article>
            <article className="home-feature-card">
              <strong>Reusable components</strong>
              <p>The category tile is data-driven, making it easy to extend or reorder later.</p>
            </article>
            <article className="home-feature-card">
              <strong>Responsive layout</strong>
              <p>The grid shifts cleanly from one column on mobile to three columns on larger screens.</p>
            </article>
          </div>
        </section>

        <div style={{ marginTop: '28px' }}>
          <FAQ />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UserHome;
