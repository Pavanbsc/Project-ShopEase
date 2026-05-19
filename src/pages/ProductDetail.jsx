import { useEffect, useMemo, useState } from 'react';
import {
  FaArrowLeft,
  FaCamera,
  FaPaperPlane,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaTruck,
  FaShareAlt,
  FaPercent,
  FaExchangeAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaThumbsUp,
  FaCheck,
  FaUndoAlt,
  FaRupeeSign,
  FaTimesCircle,
} from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopNavbar from '../components/TopNavbar';
import { addProductToCart, getProductById, getProductsByCategory, isWishlisted, toggleWishlistProduct, getLoggedInUser } from '../services/api';
import '../styles/user-products.css';
import '../styles/product-detail-premium.css';

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

const getColorVariants = (product) => {
  if (!Array.isArray(product.variants)) return [];
  const values = product.variants
    .map((variant) => variant.Color || variant.color || variant.Colour || null)
    .filter(Boolean);
  return [...new Set(values)];
};

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWished, setIsWished] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState('');
  const [expandedSection, setExpandedSection] = useState('description');
  const [reviewFilter, setReviewFilter] = useState('Most recent');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewCards, setReviewCards] = useState([
    { name: 'Priya Sharma', rating: 5, date: '2 days ago', title: 'Excellent performance and display', comment: 'Fast, smooth and exactly as described. Great thermals and premium build quality.', verified: true, images: [] },
    { name: 'Amit Verma', rating: 4, date: '1 week ago', title: 'Very good for gaming and work', comment: 'Battery life is decent and display is crisp. Happy with the purchase overall.', verified: true, images: [] },
    { name: 'Neha Roy', rating: 5, date: '3 weeks ago', title: 'Worth the price', comment: 'Powerful machine for multitasking and games. Delivery was quick too.', verified: true, images: [] },
  ]);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    title: '',
    comment: '',
    rating: 5,
    verifiedPurchase: true,
  });
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]);

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      const user = getLoggedInUser();
      if (!user) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }
      await addProductToCart(product, quantity);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err?.message || 'Failed to add to cart');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductById(productId);
        setProduct(data);
        setIsWished(isWishlisted(data.id));

        const categoryId = Number(data?.category?.id || data?.categoryId || 0);
        if (categoryId) {
          const related = await getProductsByCategory(categoryId);
          setRelatedProducts(
            related
              .filter((item) => String(item.id) !== String(data.id))
              .slice(0, 8)
          );
        } else {
          setRelatedProducts([]);
        }
      } catch (apiError) {
        setError(apiError?.response?.data?.message || apiError?.message || 'Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  useEffect(() => () => {
    reviewImagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [reviewImagePreviews]);

  const display = useMemo(() => {
    if (!product) return null;

    const price = Number(product.price ?? product.finalPrice ?? 0);
    const originalPrice = Number(product.originalPrice ?? price);
    const discount = Number(product.discountPercent || (originalPrice > 0 ? ((originalPrice - price) / originalPrice) * 100 : 0));
    const stock = Number(product.stockQuantity ?? product.stock ?? 0);
    const inStock = stock > 0;

    const images = product.images && product.images.length ? product.images : [product.imageUrl || 'https://via.placeholder.com/640x640?text=ShopEase'];
    const rawVariants = Array.isArray(product.variants) ? product.variants : [];
    const extractValues = (keys) => [...new Set(rawVariants.map((variant) => {
      for (const key of keys) {
        if (variant?.[key]) return String(variant[key]);
      }
      return null;
    }).filter(Boolean))];

    return {
      price,
      originalPrice,
      discount,
      savings: Math.max(0, originalPrice - price),
      stock,
      inStock,
      soldCount: Number(product.soldCount || product.unitsSold || 0) || (200 + Number(product.id || 1) * 3),
      sku: product.sku || product.id || `SE-${productId}`,
      category: product.category?.name || product.category || 'Uncategorized',
      image: images[selectedImage] || images[0],
      images,
      colors: getColorVariants(product),
      storage: extractValues(['storage', 'Storage', 'capacity', 'Capacity']),
      ram: extractValues(['ram', 'RAM', 'memory', 'Memory']),
      sizes: extractValues(['size', 'Size', 'sizes']),
      styles: extractValues(['style', 'Style']),
      rating: getProductRating(product),
      reviewCount: getReviewCount(product),
    };
  }, [product, selectedImage]);

  const handleCheckPincode = () => {
    if (!pincode || pincode.length < 3) {
      setPincodeResult('Enter a valid pincode');
      return;
    }
    const eta = Math.random() > 0.5 ? 'Tomorrow' : '2-3 business days';
    setPincodeResult(`${eta} • Free delivery available • COD ${Math.random() > 0.5 ? 'available' : 'limited'}`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied');
    } catch {
      toast.info('Unable to copy link');
    }
  };

  const handleReviewImagesChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4);
    if (!files.length) return;

    setReviewImages(files);
    setReviewImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return files.map((file) => URL.createObjectURL(file));
    });
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    const reviewerName = reviewForm.name.trim() || 'Verified Buyer';
    const reviewTitle = reviewForm.title.trim();
    const reviewComment = reviewForm.comment.trim();

    if (!reviewComment || reviewComment.length < 12) {
      toast.error('Please write a detailed review with at least 12 characters.');
      return;
    }

    if (!reviewForm.verifiedPurchase) {
      toast.error('Only verified buyers can submit a product review.');
      return;
    }

    const newReview = {
      name: reviewerName,
      rating: reviewForm.rating,
      date: 'Just now',
      title: reviewTitle || 'User review',
      comment: reviewComment,
      verified: true,
      images: reviewImagePreviews,
    };

    setReviewCards((prev) => [newReview, ...prev]);
    setReviewForm({ name: '', title: '', comment: '', rating: 5, verifiedPurchase: true });
    setReviewImages([]);
    setReviewImagePreviews([]);
    toast.success('Review submitted successfully');
  };

  const reviewStats = [
    { star: 5, pct: 70 },
    { star: 4, pct: 20 },
    { star: 3, pct: 7 },
    { star: 2, pct: 2 },
    { star: 1, pct: 1 },
  ];

  return (
    <div className="se-dashboard-page se-product-detail-page">
      <TopNavbar />

      <main className="se-main-content">
        <section className="se-home-section se-detail-shell">
          <div className="se-detail-top-links">
            <button type="button" className="se-detail-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>
            <Link to="/products" className="se-detail-link">All Products</Link>
          </div>

          {loading ? <div className="loading-state">Loading product details...</div> : null}
          {!loading && error ? <div className="empty-state">{error}</div> : null}

          {!loading && !error && product && display ? (
            <>
            <article className="se-detail-layout se-detail-premium-layout">
              <div className="se-detail-media se-detail-media-premium">
                <img src={display.image} alt={product.name} className="se-detail-main-image" />
                {display.discount > 0 ? <span className="se-discount-badge">{Math.round(display.discount)}% OFF</span> : null}

                <button type="button" className="se-media-float-btn se-share-float-btn" onClick={handleShare} title="Share product"><FaShareAlt /></button>
                <button
                  type="button"
                  className="se-media-float-btn se-wishlist-float-btn"
                  onClick={() => {
                    const result = toggleWishlistProduct(product);
                    setIsWished(result.isWishlisted);
                    toast.success(result.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
                  }}
                  title="Add to wishlist"
                >
                  {isWished ? <FaHeart /> : <FaRegHeart />}
                </button>

                {display.images.length > 1 ? (
                  <div className="se-thumbnail-strip">
                    {display.images.map((img, index) => (
                      <button key={`${img}-${index}`} type="button" className={`se-thumb-item ${selectedImage === index ? 'active' : ''}`} onClick={() => setSelectedImage(index)}>
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="se-detail-content se-detail-content-premium">
                <div className="se-product-kicker-row">
                  <span className="se-detail-brand">{product.brand || 'ShopEase'}</span>
                  <button type="button" className="se-inline-share-btn" onClick={handleShare}><FaShareAlt /> Share</button>
                </div>

                <h1 className="se-product-title">{product.name}</h1>
                <p className="se-detail-category">{display.category}</p>

                <div className="se-short-highlights">
                  <span>SKU: {display.sku}</span>
                  <span>{display.soldCount.toLocaleString('en-IN')} sold</span>
                  <span>Popular choice</span>
                </div>

                <div className="se-product-rating-row se-rating-summary-row">
                  <span className="se-rating-pill"><FaStar /> {display.rating}</span>
                  <span className="se-review-count">{display.reviewCount.toLocaleString('en-IN')} ratings • {Math.max(0, display.reviewCount - 8).toLocaleString('en-IN')} reviews</span>
                  <span className="se-verified-buyers">✓ Verified buyers</span>
                </div>

                  <div className="se-product-price-row se-price-card">
                  <strong>{formatCurrency(display.price)}</strong>
                  {display.originalPrice > display.price ? <span className="se-strike-price">{formatCurrency(display.originalPrice)}</span> : null}
                  {display.discount > 0 ? <span className="se-discount-text">{Math.round(display.discount)}% off</span> : null}
                  {display.savings > 0 ? <span className="se-save-text">You save {formatCurrency(display.savings)}</span> : null}
                </div>

                <div className="se-price-meta-row">
                  <span>EMI starting from ₹1,499/month</span>
                  <span>Inclusive of all taxes</span>
                  <span className="se-limited-deal">Limited-time deal</span>
                </div>

                <div className="se-detail-offers">
                  <div className="se-offer-item"><FaTag /> <span>Bank offers available</span></div>
                  <div className="se-offer-item"><FaPercent /> <span>Coupon offers and seasonal deals</span></div>
                  <div className="se-offer-item"><FaExchangeAlt /> <span>Exchange offer</span></div>
                  <div className="se-offer-item"><FaTruck /> <span>Free shipping offer</span></div>
                  <div className="se-offer-item"><FaCheck /> <span>Cash on delivery available</span></div>
                </div>

                <div className="se-delivery-box">
                  <div className="se-delivery-head">Delivery</div>
                  <div className="se-pincode-row">
                    <input type="text" placeholder="Enter pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                    <button type="button" onClick={handleCheckPincode}>Check</button>
                  </div>
                  <div className="se-delivery-meta">
                    <span>{pincodeResult || 'Delivery estimate after pincode check'}</span>
                    <span>Delivery partner: ShopEase Logistics</span>
                    <span>Same-day / next-day may apply on eligible pincodes</span>
                  </div>
                </div>

                <div className="se-variant-section">
                  {display.colors.length ? (
                    <div className="se-variant-group">
                      <div className="se-variant-label">Color variants</div>
                      <div className="se-chip-wrap">
                        {display.colors.map((color) => (
                          <button key={color} type="button" className={`se-variant-chip ${(selectedVariants.color || display.colors[0]) === color ? 'active' : ''}`} onClick={() => setSelectedVariants((prev) => ({ ...prev, color }))}>{color}</button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {display.storage.length ? (
                    <div className="se-variant-group">
                      <div className="se-variant-label">Storage</div>
                      <div className="se-chip-wrap">
                        {display.storage.map((item) => (
                          <button key={item} type="button" className={`se-variant-chip ${selectedVariants.storage === item ? 'active' : ''}`} onClick={() => setSelectedVariants((prev) => ({ ...prev, storage: item }))}>{item}</button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {display.ram.length ? (
                    <div className="se-variant-group">
                      <div className="se-variant-label">RAM</div>
                      <div className="se-chip-wrap">
                        {display.ram.map((item) => (
                          <button key={item} type="button" className={`se-variant-chip ${selectedVariants.ram === item ? 'active' : ''}`} onClick={() => setSelectedVariants((prev) => ({ ...prev, ram: item }))}>{item}</button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {display.sizes.length ? (
                    <div className="se-variant-group">
                      <div className="se-variant-label">Size</div>
                      <div className="se-chip-wrap">
                        {display.sizes.map((item) => (
                          <button key={item} type="button" className={`se-variant-chip ${selectedVariants.size === item ? 'active' : ''}`} onClick={() => setSelectedVariants((prev) => ({ ...prev, size: item }))}>{item}</button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {display.styles.length ? (
                    <div className="se-variant-group">
                      <div className="se-variant-label">Style</div>
                      <div className="se-chip-wrap">
                        {display.styles.map((item) => (
                          <button key={item} type="button" className={`se-variant-chip ${selectedVariants.style === item ? 'active' : ''}`} onClick={() => setSelectedVariants((prev) => ({ ...prev, style: item }))}>{item}</button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className={`se-stock-status ${display.inStock ? (display.stock <= 10 ? 'low' : 'in') : 'out'}`}>
                  {display.inStock ? (display.stock <= 10 ? `Only ${display.stock} left in stock` : 'In stock') : 'Out of stock'}
                </div>

                <div className="se-detail-actions">
                  <button type="button" className="se-add-cart-btn" disabled={!display.inStock || product.active === false} onClick={() => handleAddToCart(product, 1)}>
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button type="button" className="se-buy-now-btn" disabled={!display.inStock || product.active === false} onClick={async () => { await handleAddToCart(product, 1); navigate('/checkout'); }}>
                    Buy Now
                  </button>
                  <button type="button" className="se-view-product-btn" onClick={() => { const result = toggleWishlistProduct(product); setIsWished(result.isWishlisted); toast.success(result.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist'); }}>
                    {isWished ? <FaHeart /> : <FaRegHeart />} {isWished ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>
                </div>

                <div className="se-confidence-strip">
                  <div className="se-confidence-card"><FaShieldAlt /><span>Warranty</span></div>
                  <div className="se-confidence-card"><FaCheckCircle /><span>7-day replacement</span></div>
                  <div className="se-confidence-card"><FaTruck /><span>Fast delivery</span></div>
                  <div className="se-confidence-card"><FaShieldAlt /><span>Secure payment</span></div>
                  <div className="se-confidence-card"><FaCheckCircle /><span>Assured quality</span></div>
                </div>

                <div className="se-detail-accordion-list">
                  <button type="button" className={`se-accordion-head ${expandedSection === 'description' ? 'open' : ''}`} onClick={() => setExpandedSection((prev) => (prev === 'description' ? '' : 'description'))}>
                    Description {expandedSection === 'description' ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {expandedSection === 'description' ? <div className="se-accordion-body">{product.description || 'No description available.'}</div> : null}

                  <button type="button" className={`se-accordion-head ${expandedSection === 'features' ? 'open' : ''}`} onClick={() => setExpandedSection((prev) => (prev === 'features' ? '' : 'features'))}>
                    Product Highlights {expandedSection === 'features' ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {expandedSection === 'features' ? <div className="se-accordion-body se-highlights-grid">{['Battery life', 'Processor', 'Connectivity', 'Water resistance', 'Material quality', 'Weight', 'Performance'].map((item) => <span key={item}>{item}</span>)}</div> : null}

                  <button type="button" className={`se-accordion-head ${expandedSection === 'specs' ? 'open' : ''}`} onClick={() => setExpandedSection((prev) => (prev === 'specs' ? '' : 'specs'))}>
                    Specifications {expandedSection === 'specs' ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {expandedSection === 'specs' ? (
                    <div className="se-accordion-body">
                      <div className="se-specs-grid">
                        {(product.specifications ? Object.entries(product.specifications) : [
                          ['Processor', 'Intel Core i7'],
                          ['RAM', '16 GB'],
                          ['Storage', '1 TB SSD'],
                          ['Display', '15.6" FHD'],
                          ['Battery', 'Up to 8 hrs'],
                          ['Connectivity', 'Wi-Fi 6 / BT'],
                          ['Camera', 'HD Webcam'],
                          ['Dimensions', 'Compact'],
                          ['Weight', '1.8 kg'],
                          ['OS', 'Windows 11'],
                          ['Warranty', product.warranty || '12 months'],
                        ]).map(([key, value]) => (
                          <div key={key} className="se-spec-item"><span>{key}</span><strong>{String(value)}</strong></div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <button type="button" className={`se-accordion-head ${expandedSection === 'warranty' ? 'open' : ''}`} onClick={() => setExpandedSection((prev) => (prev === 'warranty' ? '' : 'warranty'))}>
                    Warranty Info {expandedSection === 'warranty' ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {expandedSection === 'warranty' ? <div className="se-accordion-body">{product.warranty || 'Standard warranty applies as per seller policy.'}</div> : null}
                </div>

                <div className="se-detail-reviews">
                  <div className="se-section-head">
                    <h3>Ratings & Reviews</h3>
                    <div className="se-review-filters">
                      {['Most recent', 'Highest rated', 'Lowest rated', 'Verified buyers only'].map((item) => (
                        <button key={item} type="button" className={reviewFilter === item ? 'active' : ''} onClick={() => setReviewFilter(item)}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div className="se-review-compose-card">
                    <div className="se-review-compose-head">
                      <div>
                        <span className="se-review-compose-kicker">Verified buyer review</span>
                        <h4>Share your experience</h4>
                        <p>Add photos and a clear review to help other shoppers make the right choice.</p>
                      </div>
                      <div className="se-review-compose-note">
                        <FaCheckCircle /> Only buyers who purchased the item can post a review
                      </div>
                    </div>

                    <form className="se-review-form" onSubmit={handleReviewSubmit}>
                      <div className="se-review-form-grid">
                        <label className="se-review-field">
                          <span>Your name</span>
                          <input
                            type="text"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your name"
                          />
                        </label>

                        <label className="se-review-field">
                          <span>Review title</span>
                          <input
                            type="text"
                            value={reviewForm.title}
                            onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Short summary of your experience"
                          />
                        </label>
                      </div>

                      <div className="se-review-rating-row">
                        <span>Rating</span>
                        <div className="se-rating-picker" role="radiogroup" aria-label="Select rating">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className={reviewForm.rating === rating ? 'active' : ''}
                              onClick={() => setReviewForm((prev) => ({ ...prev, rating }))}
                            >
                              {rating} <FaStar />
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="se-review-field se-review-field-textarea">
                        <span>Your review</span>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                          placeholder="Tell others about the product quality, performance, delivery, and value for money"
                          rows={5}
                        />
                      </label>

                      <div className="se-review-upload-row">
                        <label className="se-review-upload-zone">
                          <FaCamera />
                          <strong>Add product photos</strong>
                          <span>Upload up to 4 images. Clear images help buyers trust the review.</span>
                          <input type="file" accept="image/*" multiple onChange={handleReviewImagesChange} />
                        </label>

                        <div className="se-review-upload-preview-grid">
                          {reviewImagePreviews.length ? reviewImagePreviews.map((src, index) => (
                            <div key={`${src}-${index}`} className="se-review-upload-preview">
                              <img src={src} alt={`Review upload ${index + 1}`} />
                            </div>
                          )) : <div className="se-review-upload-empty">No images selected yet</div>}
                        </div>
                      </div>

                      <div className="se-review-submit-row">
                        <label className="se-review-checkbox">
                          <input
                            type="checkbox"
                            checked={reviewForm.verifiedPurchase}
                            onChange={(e) => setReviewForm((prev) => ({ ...prev, verifiedPurchase: e.target.checked }))}
                          />
                          <span>I confirm that I purchased this item</span>
                        </label>

                        <button type="submit" className="se-review-submit-btn">
                          <FaPaperPlane /> Submit review
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="se-reviews-layout">
                    <div className="se-rating-summary-card">
                      <div className="se-rating-large">{display.rating}</div>
                      <div className="se-rating-stars"><FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar /></div>
                      <p>{display.reviewCount.toLocaleString('en-IN')} ratings</p>
                      <p>{Math.max(0, display.reviewCount - 8).toLocaleString('en-IN')} reviews</p>
                      <p>✓ Verified buyers</p>
                      <div className="se-star-bars">
                        {reviewStats.map((stat) => (
                          <div key={stat.star} className="se-star-bar-row">
                            <span>{stat.star}★</span>
                            <div className="se-star-bar"><span style={{ width: `${stat.pct}%` }} /></div>
                            <strong>{stat.pct}%</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="se-reviews-main">
                      <div className="se-review-tag-row">
                        {['Camera 4.4★', 'Battery 4.5★', 'Display 4.2★', 'Performance 4.1★'].map((item) => <span key={item}>{item}</span>)}
                      </div>

                      {reviewCards.map((review) => (
                        <div key={review.name + review.date} className="se-review-card">
                          <div className="se-review-top">
                            <div className="se-review-avatar">{review.name.charAt(0)}</div>
                            <div>
                              <div className="se-review-name-row">
                                <strong>{review.name}</strong>
                                {review.verified ? <span className="se-verified-pill">Verified purchase</span> : null}
                              </div>
                              <div className="se-review-stars">
                                {[...Array(5)].map((_, idx) => <FaStar key={idx} style={{ opacity: idx < review.rating ? 1 : 0.25 }} />)}
                              </div>
                            </div>
                          </div>
                          {review.title ? <h4>{review.title}</h4> : null}
                          {review.comment ? <p>{review.comment}</p> : null}
                          {review.images?.length ? (
                            <div className="se-review-image-row">
                              {review.images.map((img, idx) => (
                                <div key={`${review.name}-${idx}`} className="se-review-image-item">
                                  <img src={img} alt={`${review.name} upload ${idx + 1}`} />
                                </div>
                              ))}
                            </div>
                          ) : null}
                          <div className="se-review-meta-row">
                            <span>{review.date}</span>
                            <button type="button" className="se-helpful-btn"><FaThumbsUp /> Helpful</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="se-specs-block se-section-card">
                  <div className="se-section-title-row">
                    <div className="se-section-title">
                      <FaStore />
                      <h3>Seller Information</h3>
                    </div>
                    <span className="se-section-underline" />
                  </div>

                  <div className="se-seller-grid">
                    <div className="se-seller-cell">
                      <span className="se-seller-icon"><FaUser /></span>
                      <div>
                        <span className="se-seller-label">SELLER NAME</span>
                        <strong>{product.sellerName || product.seller?.name || 'ASUS India'}</strong>
                      </div>
                    </div>
                    <div className="se-seller-cell">
                      <span className="se-seller-icon"><FaStar /></span>
                      <div>
                        <span className="se-seller-label">SELLER RATING</span>
                        <strong>
                          {product.sellerRating || '4.6/5'} <span className="se-top-rated-pill">Top Rated</span>
                        </strong>
                      </div>
                    </div>
                    <div className="se-seller-cell">
                      <span className="se-seller-icon"><FaMapMarkerAlt /></span>
                      <div>
                        <span className="se-seller-label">SELLER LOCATION</span>
                        <strong>{product.sellerLocation || product.seller?.location || 'Chennai, Tamil Nadu'}</strong>
                      </div>
                    </div>
                    <div className="se-seller-cell">
                      <span className="se-seller-icon"><FaStore /></span>
                      <div>
                        <span className="se-seller-label">BRAND STORE</span>
                        <strong>Available <span className="se-available-check">✓</span></strong>
                      </div>
                    </div>
                    <div className="se-seller-cell">
                      <span className="se-seller-icon"><FaClock /></span>
                      <div>
                        <span className="se-seller-label">RESPONSE TIME</span>
                        <strong>Within 24 hours</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="se-specs-block se-section-card">
                  <div className="se-section-title-row">
                    <div className="se-section-title">
                      <FaShieldAlt />
                      <h3>Policy</h3>
                    </div>
                    <span className="se-section-underline" />
                  </div>

                  <div className="se-policy-grid">
                    <div className="se-policy-cell">
                      <span className="se-policy-icon"><FaUndoAlt /></span>
                      <span className="se-policy-label">RETURN POLICY</span>
                      <strong>{product.returnPolicy || '7-day replacement'}</strong>
                      <button type="button" className="se-policy-link">Know more <span>›</span></button>
                    </div>
                    <div className="se-policy-cell">
                      <span className="se-policy-icon"><FaRupeeSign /></span>
                      <span className="se-policy-label">REFUND POLICY</span>
                      <strong>Refund processed to original method</strong>
                      <button type="button" className="se-policy-link">Know more <span>›</span></button>
                    </div>
                    <div className="se-policy-cell">
                      <span className="se-policy-icon"><FaShieldAlt /></span>
                      <span className="se-policy-label">WARRANTY POLICY</span>
                      <strong>{product.warranty || '12 months'}</strong>
                      <button type="button" className="se-policy-link">Know more <span>›</span></button>
                    </div>
                    <div className="se-policy-cell">
                      <span className="se-policy-icon"><FaTimesCircle /></span>
                      <span className="se-policy-label">CANCELLATION</span>
                      <strong>Before shipment</strong>
                      <button type="button" className="se-policy-link">Know more <span>›</span></button>
                    </div>
                  </div>
                </div>

                <div className="se-sticky-actions">
                  <button type="button" className="se-sticky-secondary" onClick={() => { const result = toggleWishlistProduct(product); setIsWished(result.isWishlisted); }}>
                    <FaHeart /> Wishlist
                  </button>
                  <button type="button" className="se-sticky-primary" onClick={() => handleAddToCart(product, 1)}>
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button type="button" className="se-sticky-primary" onClick={async () => { await handleAddToCart(product, 1); navigate('/checkout'); }}>
                    Buy Now
                  </button>
                </div>
              </div>
            </article>

            <section className="se-related-products-block se-related-full-width">
              <div className="se-section-title-row se-related-section-head">
                <div className="se-section-title">
                  <FaTag />
                  <h3>You May Also Like</h3>
                </div>
                <span className="se-section-underline" />
              </div>

              {relatedProducts.length ? (
                <div className="se-related-row se-related-row-full">
                  {relatedProducts.map((item) => {
                    const price = Number(item.price ?? item.finalPrice ?? 0);
                    const originalPrice = Number(item.originalPrice ?? price);
                    const image = item.imageUrl || item.images?.[0] || 'https://via.placeholder.com/320x320?text=ShopEase';

                    return (
                      <Link key={item.id} to={`/products/${item.id}`} className="se-related-card se-related-card-full">
                        <div className="se-related-image">
                          <img src={image} alt={item.name} />
                        </div>
                        <strong>{item.name}</strong>
                        <div className="se-related-price-row">
                          <p>{formatCurrency(price)}</p>
                          {originalPrice > price ? <span className="se-related-old-price">{formatCurrency(originalPrice)}</span> : null}
                        </div>
                        {originalPrice > price ? (
                          <span className="se-related-discount-pill">{Math.round(((originalPrice - price) / originalPrice) * 100)}% off</span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="se-related-empty">No more products found in this category.</div>
              )}
            </section>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default ProductDetail;
