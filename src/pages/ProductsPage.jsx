import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import { useShopData } from '../context/ShopDataContext';
import { getProducts } from '../services/api';

function ProductsPage() {
  const { categories, isLoadingCategories } = useShopData();
  const [products, setProducts] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState('');

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

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds((previous) => {
      if (previous.includes(categoryId)) {
        return previous.filter((id) => id !== categoryId);
      }
      return [...previous, categoryId];
    });
  };

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryIds.length) {
      return products;
    }

    return products.filter((product) => selectedCategoryIds.includes(product.category?.id));
  }, [products, selectedCategoryIds]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>All Products</h1>
          <p>Use category filters to narrow down product discovery instantly.</p>
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
        </aside>

        <div className="products-content">
          {isLoadingProducts ? <div className="loading-state">Loading products...</div> : null}
          {!isLoadingProducts && error ? <div className="empty-state">{error}</div> : null}
          {!isLoadingProducts && !error ? <ProductGrid products={filteredProducts} /> : null}
        </div>
      </section>
    </div>
  );
}

export default ProductsPage;
