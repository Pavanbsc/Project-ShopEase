import { useMemo, useState } from 'react';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addProductToCart, isWishlisted, toggleWishlistProduct } from '../services/api';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const getProductRating = (product) => {
  if (product.rating) return Number(product.rating).toFixed(1);
  const seed = Number(product.id || 1) % 12;
  return (3.8 + seed / 10).toFixed(1);
};

const getReviewCount = (product) => {
  if (product.reviewCount) return Number(product.reviewCount);
  return 120 + Number(product.id || 1) * 7;
};

const getCouponText = (product) => {
  const discount = Number(product.discountPercent || 0);
  if (discount >= 30) return 'Extra 10% coupon available';
  if (discount >= 20) return 'Bank offer available';
  return 'Free shipping on eligible orders';
};

function ProductGrid({ products }) {
  const navigate = useNavigate();
  const [wishlistState, setWishlistState] = useState({});

  const wishedLookup = useMemo(() => {
    const lookup = {};
    products.forEach((product) => {
      lookup[product.id] = typeof wishlistState[product.id] === 'boolean' ? wishlistState[product.id] : isWishlisted(product.id);
    });
    return lookup;
  }, [products, wishlistState]);

  if (!products.length) {
    return <div className="empty-state">No products available for this selection.</div>;
  }

  return (
    <div className="se-product-grid">
      {products.map((product) => {
        const price = Number(product.finalPrice ?? product.price ?? 0);
        const originalPrice = Number(product.originalPrice ?? price);
        const stock = Number(product.stockQuantity ?? product.stock ?? 0);
        const isOutOfStock = stock <= 0;
        const image = product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/360x360?text=ShopEase';
        const discount = Number(product.discountPercent || (originalPrice > 0 ? ((originalPrice - price) / originalPrice) * 100 : 0));

        return (
          <article
            className={`se-product-card ${isOutOfStock ? 'out' : ''}`}
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') navigate(`/products/${product.id}`);
            }}
          >
            <div className="se-product-media-wrap">
              <img src={image} alt={product.name} className="se-product-media" loading="lazy" />
              {discount > 0 ? <span className="se-discount-badge">{Math.round(discount)}% OFF</span> : null}
              {!product.active ? <span className="se-disabled-badge">Disabled</span> : null}
              <button
                type="button"
                className="se-wishlist-btn"
                aria-label="Toggle wishlist"
                onClick={(event) => {
                  event.stopPropagation();
                  const result = toggleWishlistProduct(product);
                  setWishlistState((prev) => ({ ...prev, [product.id]: result.isWishlisted }));
                  toast.success(result.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
                }}
              >
                {wishedLookup[product.id] ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            <div className="se-product-body">
              <span className="se-product-brand">{product.brand || 'ShopEase'}</span>
              <h3>{product.name}</h3>
              <p className="se-product-category">{product.category?.name || product.category || 'Uncategorized'}</p>

              <div className="se-product-rating-row">
                <span className="se-rating-pill"><FaStar /> {getProductRating(product)}</span>
                <span className="se-review-count">({getReviewCount(product).toLocaleString('en-IN')})</span>
              </div>

              <div className="se-product-price-row">
                <strong>{formatCurrency(price)}</strong>
                {originalPrice > price ? <span className="se-strike-price">{formatCurrency(originalPrice)}</span> : null}
                {discount > 0 ? <span className="se-discount-text">{Math.round(discount)}% off</span> : null}
              </div>

              <p className="se-coupon-text">{getCouponText(product)}</p>

              <div className="se-product-card-actions">
                <button
                  type="button"
                  className="se-add-cart-btn"
                  disabled={isOutOfStock || product.active === false}
                  onClick={async (event) => {
                    event.stopPropagation();
                    if (isOutOfStock) return;
                    try {
                      await addProductToCart(product, 1);
                      toast.success('Added to cart');
                    } catch (error) {
                      toast.error(error?.response?.data?.message || error?.message || 'Failed to add to cart');
                    }
                  }}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  type="button"
                  className="se-view-product-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/products/${product.id}`);
                  }}
                >
                  View Product
                </button>
              </div>

              <div className={`se-stock-status ${isOutOfStock ? 'out' : stock <= 10 ? 'low' : 'in'}`}>
                {isOutOfStock ? 'Out of stock' : stock <= 10 ? `Only ${stock} left` : 'In stock'}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductGrid;
