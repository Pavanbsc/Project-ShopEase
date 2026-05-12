import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import { useShopData } from '../context/ShopDataContext';
import { addToCart, getLoggedInUser, getProducts } from '../services/api';

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const CATEGORY_ALIAS_MAP = {
  mobiles: ['mobilephones', 'mobiles', 'mobile'],
  mobilephones: ['mobilephones', 'mobiles', 'mobile'],
  laptops: ['laptops', 'laptop'],
  electronics: ['electronics', 'accessories', 'tablets'],
  fashion: ['fashion', 'clothing', 'mensfashion', 'womensfashion', 'kidswear', 'footwear'],
  'homekitchen': ['homeappliance', 'kitchenappliance', 'furniture', 'homedecor'],
  sports: ['sportsshoes', 'sports'],
};

function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, isLoadingCategories } = useShopData();
  const [products, setProducts] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState('');
  const [addingProductId, setAddingProductId] = useState(null);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const requestedCategoryName = (query.get('category') || location.state?.category || '').trim();
  const requestedSubcategory = (query.get('subcategory') || location.state?.subcategory || '').trim();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setError('');
        const data = await getProducts();
        setProducts(data);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || 'Unable to load products.');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    if (!requestedCategoryName) {
      setSelectedCategoryName('');
      setSelectedSubcategory('');
      return;
    }

    const requestedNormalized = normalizeText(requestedCategoryName);
    const aliases = CATEGORY_ALIAS_MAP[requestedNormalized] || [requestedNormalized];

    const matchedCategories = categories.filter((category) => {
      const categoryNormalized = normalizeText(category.name);
      return aliases.includes(categoryNormalized);
    });

    // Fallback to exact normalized match if alias map did not resolve anything.
    const fallbackMatch = !matchedCategories.length
      ? categories.filter((category) => normalizeText(category.name) === requestedNormalized)
      : [];

    const resolvedMatches = matchedCategories.length ? matchedCategories : fallbackMatch;

    if (resolvedMatches.length) {
      setSelectedCategoryIds(resolvedMatches.map((category) => category.id));
      setSelectedCategoryName(requestedCategoryName);
      setSelectedSubcategory(requestedSubcategory);
      return;
    }

    setSelectedCategoryName(requestedCategoryName);
    setSelectedSubcategory(requestedSubcategory);
  }, [categories, requestedCategoryName, requestedSubcategory]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds((previous) => {
      if (previous.includes(categoryId)) {
        return previous.filter((id) => id !== categoryId);
      }
      return [...previous, categoryId];
    });
  };

  const filteredProducts = useMemo(() => {
    const categoryFiltered = !selectedCategoryIds.length
      ? products
      : products.filter((product) =>
          selectedCategoryIds.includes(Number(product.category_id ?? product.category?.id))
        );

    if (!selectedSubcategory) {
      return categoryFiltered;
    }

    const hasSubcategoryData = categoryFiltered.some(
      (product) => product.subcategory_name || product.subcategory || product.subCategory
    );

    if (!hasSubcategoryData) {
      return categoryFiltered;
    }

    return categoryFiltered.filter((product) => {
      const productSubcategory = String(
        product.subcategory_name || product.subcategory || product.subCategory || ''
      ).trim();
      return productSubcategory.toLowerCase() === selectedSubcategory.toLowerCase();
    });
  }, [products, selectedCategoryIds, selectedSubcategory]);

  const handleAddToCart = async (product) => {
    const user = getLoggedInUser();

    if (!user?.id) {
      navigate('/login');
      return;
    }

    try {
      setAddingProductId(product.id);
      const cart = await addToCart(user.id, { productId: product.id, quantity: 1 });
      const cartCount = (cart.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      window.localStorage.setItem('shopease_cart_count', String(cartCount));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.name} added to cart.`);
    } catch (apiError) {
      toast.error(apiError?.response?.data?.message || 'Unable to add item to cart.');
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>
            {selectedCategoryName
              ? `${selectedCategoryName}${selectedSubcategory ? ` / ${selectedSubcategory}` : ''}`
              : 'All Products'}
          </h1>
          <p>
            {selectedCategoryName
              ? 'Showing products from the selected category.'
              : 'Use category filters to narrow down product discovery instantly.'}
          </p>
        </div>
        <Link to="/home" className="status-link">
          Back to Home
        </Link>
      </header>

      <CategoryNav />

      <section className="products-layout">
        <aside className="filter-panel" aria-label="Category filters">
          <h3>Filter by category</h3>
          {isLoadingCategories ? <p className="filter-note">Loading categories...</p> : null}
          {!isLoadingCategories && !categories.length ? (
            <p className="filter-note">No categories available.</p>
          ) : null}

          <div className="filter-list">
            {categories.map((category) => (
              <label key={category.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>

          <button type="button" className="clear-btn" onClick={() => setSelectedCategoryIds([])}>
            Clear filters
          </button>
          {(selectedCategoryName || selectedSubcategory) ? (
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setSelectedCategoryIds([]);
                setSelectedCategoryName('');
                setSelectedSubcategory('');
                navigate('/products', { replace: true });
              }}
              style={{ marginTop: '10px' }}
            >
              Clear deep link
            </button>
          ) : null}
        </aside>

        <div className="products-content">
          {isLoadingProducts ? <div className="loading-state">Loading products...</div> : null}
          {!isLoadingProducts && error ? <div className="empty-state">{error}</div> : null}
          {!isLoadingProducts && !error ? (
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              addingProductId={addingProductId}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default ProductsPage;
