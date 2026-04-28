import {
  FaBook,
  FaBolt,
  FaFootballBall,
  FaHome,
  FaMobileAlt,
  FaShoePrints,
  FaShoppingBasket,
  FaShoppingBag,
  FaSnowflake,
  FaStar,
  FaTabletAlt,
  FaTags,
  FaCar,
  FaClock,
  FaGem,
  FaPaw,
  FaTshirt,
  FaTruck,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useShopData } from '../context/ShopDataContext';

const CATEGORY_PALETTES = [
  { start: '#667eea', end: '#764ba2', glow: 'rgba(102, 126, 234, 0.22)' },
  { start: '#0ea5e9', end: '#2563eb', glow: 'rgba(14, 165, 233, 0.18)' },
  { start: '#f59e0b', end: '#ef4444', glow: 'rgba(245, 158, 11, 0.18)' },
  { start: '#10b981', end: '#0f766e', glow: 'rgba(16, 185, 129, 0.18)' },
  { start: '#8b5cf6', end: '#ec4899', glow: 'rgba(139, 92, 246, 0.18)' },
  { start: '#0f172a', end: '#334155', glow: 'rgba(15, 23, 42, 0.16)' },
];

const iconMap = {
  electronics: FaBolt,
  mobiles: FaMobileAlt,
  mobile: FaMobileAlt,
  laptop: FaTabletAlt,
  laptops: FaTabletAlt,
  tablet: FaTabletAlt,
  tablets: FaTabletAlt,
  fashion: FaTshirt,
  clothing: FaTshirt,
  footwear: FaShoePrints,
  shoes: FaShoePrints,
  appliances: FaSnowflake,
  home: FaHome,
  furniture: FaHome,
  decor: FaHome,
  books: FaBook,
  stationery: FaTags,
  beauty: FaStar,
  wellness: FaStar,
  sports: FaFootballBall,
  toys: FaTruck,
  grocery: FaShoppingBasket,
  groceries: FaShoppingBasket,
  automotive: FaCar,
  jewelry: FaGem,
  watches: FaClock,
  bags: FaShoppingBag,
  luggage: FaShoppingBag,
  pet: FaPaw,
  default: FaTags,
};

function resolveIcon(name) {
  const normalized = (name || '').toLowerCase();
  if (iconMap[normalized]) {
    return iconMap[normalized];
  }

  const matchedKey = Object.keys(iconMap).find(
    (key) => key !== 'default' && normalized.includes(key)
  );

  return matchedKey ? iconMap[matchedKey] : iconMap.default;
}

function resolveImage(category) {
  return (
    category?.imageUrl ||
    category?.image ||
    category?.thumbnail ||
    category?.banner ||
    category?.iconUrl ||
    ''
  );
}

function tileVariant(index) {
  const mod = index % 8;
  if (mod === 0 || mod === 5) {
    return 'featured';
  }

  if (mod === 3) {
    return 'tall';
  }

  return 'standard';
}

function CategoryGrid({ activeCategoryId = null }) {
  const navigate = useNavigate();
  const { categories, isLoadingCategories, categoriesError } = useShopData();

  if (isLoadingCategories) {
    return <div className="loading-state">Loading categories...</div>;
  }

  if (!categories.length) {
    return <div className="empty-state">No categories available right now.</div>;
  }

  return (
    <div className="se-category-wrap">
      {categoriesError ? <div className="se-soft-note">{categoriesError}</div> : null}
      <div className="se-category-board" aria-label="Shop by Category">
        {categories.map((category, index) => {
          const Icon = resolveIcon(category.name);
          const isActive = String(activeCategoryId) === String(category.id);
          const imageSrc = resolveImage(category);
          const palette = CATEGORY_PALETTES[index % CATEGORY_PALETTES.length];
          const variant = tileVariant(index);
          const isFeatured = variant === 'featured' || variant === 'tall';

          return (
            <button
              type="button"
              key={`${category.id}-${index}`}
              className={`se-category-tile se-category-tile--${variant} ${isActive ? 'active' : ''}`}
              onClick={() => navigate(`/category/${category.id}`)}
              style={{
                '--category-start': palette.start,
                '--category-end': palette.end,
                '--category-glow': palette.glow,
              }}
            >
              <div className="se-category-tile-media" aria-hidden="true">
                <div className="se-category-tile-overlay" />
                {imageSrc ? (
                  <img src={imageSrc} alt="" className="se-category-tile-image" loading="lazy" />
                ) : (
                  <span className="se-category-tile-icon">
                    <Icon />
                  </span>
                )}

                <div className="se-category-tile-meta">
                  <span className="se-category-tile-tag">{isFeatured ? 'Featured' : 'Shop'}</span>
                  <h3>{category.name}</h3>
                  <p>{category.description || 'Curated picks tailored for your style.'}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryGrid;
