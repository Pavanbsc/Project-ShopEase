import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaShoppingCart, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { addProductToCart, getWishlistItems, toggleWishlistProduct, getLoggedInUser } from '../services/api';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const syncWishlist = () => {
      setItems(getWishlistItems());
      setUserChecked(true);
    };

    syncWishlist();
    window.addEventListener('wishlistUpdated', syncWishlist);
    window.addEventListener('storage', syncWishlist);
    return () => {
      window.removeEventListener('wishlistUpdated', syncWishlist);
      window.removeEventListener('storage', syncWishlist);
    };
  }, [navigate]);

  const summary = useMemo(() => ({ count: items.length }), [items]);

  const handleRemove = (product) => {
    const result = toggleWishlistProduct(product);
    setItems(result.items);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = async (product) => {
    try {
      await addProductToCart(product, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to add to cart');
    }
  };

  if (!userChecked) {
    return (
      <div className="se-dashboard-page">
        <TopNavbar />
        <main className="se-main-content">
          <div className="loading-state">Loading wishlist...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="se-dashboard-page">
      <TopNavbar />
      <main className="se-main-content">
        <section className="se-home-section">
          <div className="se-detail-top-links" style={{ marginBottom: '1rem' }}>
            <button type="button" className="se-detail-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>
            <div className="se-checkout-badge" style={{ background: '#eef4ff', color: '#2d5bd1' }}>
              <FaHeart /> Saved items
            </div>
          </div>

          <div className="se-checkout-hero" style={{ marginBottom: '1.25rem' }}>
            <div className="se-checkout-hero-copy">
              <h2 style={{ margin: 0, fontSize: '1.45rem', lineHeight: 1.2 }}>Your wishlist</h2>
              <p style={{ marginTop: '0.35rem', fontSize: '0.92rem', lineHeight: 1.45, maxWidth: '720px' }}>
                Products you save here will stay available for quick access, move to cart, or remove whenever you want.
              </p>
            </div>
            <div className="se-checkout-badge" style={{ background: '#eef7ef', color: '#1d8a4c' }}>
              {summary.count} item{summary.count !== 1 ? 's' : ''}
            </div>
          </div>

          {!items.length ? (
            <div className="se-empty-cart-summary" style={{ minHeight: '280px' }}>
              <FaHeart style={{ fontSize: '2.25rem', color: '#6b84ea' }} />
              <h2 style={{ margin: 0 }}>Your wishlist is empty</h2>
              <p style={{ margin: 0 }}>Tap the heart icon on any product to save it here.</p>
              <button className="se-primary-button" type="button" onClick={() => navigate('/products')}>
                Browse products
              </button>
            </div>
          ) : (
            <div className="se-product-grid">
              {items.map((product) => {
                const price = Number(product.price ?? product.finalPrice ?? 0);
                const originalPrice = Number(product.originalPrice ?? price);
                const image = product.image || product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/360x360?text=ShopEase';
                const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

                return (
                  <article className="se-product-card" key={product.id}>
                    <Link to={`/products/${product.id}`} className="se-product-media-wrap" style={{ textDecoration: 'none' }}>
                      <img src={image} alt={product.name} className="se-product-media" loading="lazy" />
                      {discount > 0 ? <span className="se-discount-badge">{discount}% OFF</span> : null}
                      <span className="se-disabled-badge" style={{ left: '0.85rem', right: 'auto' }}>
                        <FaHeart /> Wishlisted
                      </span>
                    </Link>

                    <div className="se-product-body">
                      <span className="se-product-brand">{product.brand || 'ShopEase'}</span>
                      <h3>{product.name}</h3>
                      <p className="se-product-category">{product.category?.name || product.category || 'Uncategorized'}</p>

                      <div className="se-product-price-row">
                        <strong>{formatCurrency(price)}</strong>
                        {originalPrice > price ? <span className="se-strike-price">{formatCurrency(originalPrice)}</span> : null}
                        {discount > 0 ? <span className="se-discount-text">{discount}% off</span> : null}
                      </div>

                      <div className="se-product-card-actions">
                        <button type="button" className="se-add-cart-btn" onClick={() => handleAddToCart(product)}>
                          <FaShoppingCart /> Add to Cart
                        </button>
                        <button type="button" className="se-view-product-btn" onClick={() => handleRemove(product)}>
                          <FaTrashAlt /> Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Wishlist;
