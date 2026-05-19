import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import { useShopData } from '../context/ShopDataContext';
import { getProducts } from '../services/api';
import '../styles/user-products.css';

const ALLOWED_LAPTOP_SKUS = new Set([
  'SHOP-LAPTOPS-1501',
  'SHOP-LAPTOPS-1502',
  'SHOP-LAPTOPS-1503',
  'SHOP-LAPTOPS-1504',
  'SHOP-LAPTOPS-1505',
]);

function ProductsPage() {
  const { categories, isLoadingCategories } = useShopData();
  const [products, setProducts] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

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

  // Read query params for direct navigations from category/subcategory pages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('categoryId');
    const sub = params.get('subcategory');

    if (categoryId) {
      setSelectedCategoryIds([Number(categoryId)]);
    }

    if (sub) {
      setSelectedSubcategory(String(sub));
    }
  }, [location.search]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds((previous) => {
      if (previous.includes(categoryId)) {
        return previous.filter((id) => id !== categoryId);
      }
      return [...previous, categoryId];
    });
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const selectedCategoryNames = new Set(
      selectedCategoryIds
        .map((id) => categories.find((category) => Number(category.id) === Number(id))?.name)
        .filter(Boolean)
        .map((name) => String(name).toLowerCase())
    );
    const selectedCategorySlugs = new Set(
      selectedCategoryIds
        .map((id) => categories.find((category) => Number(category.id) === Number(id))?.slug)
        .filter(Boolean)
        .map((slug) => String(slug).toLowerCase())
    );

    if (!selectedCategoryIds.length) {
      // If only subcategory is selected without category, attempt to filter
      return products.filter((product) => {
        if (selectedSubcategory && product.subcategory !== selectedSubcategory) {
          return false;
        }

        const stockQty = Number(product.stockQuantity ?? product.stock ?? 0);
        if (stockFilter === 'in-stock' && stockQty <= 0) return false;
        if (stockFilter === 'out-of-stock' && stockQty > 0) return false;

        if (!normalizedSearch) return true;
        return [product.name, product.brand, product.category?.name, product.category, product.sellerName]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));
      });
    }

    return products.filter((product) => {
      const productCategoryId = Number(product.category?.id ?? product.categoryId);
      const productCategoryName = String(
        typeof product.category === 'object' ? product.category?.name : product.category || ''
      ).toLowerCase();
      const productCategorySlug = String(product.category?.slug || product.categorySlug || '').toLowerCase();

      const matchesCategoryByNameOrSlug =
        selectedCategoryNames.has(productCategoryName)
        || selectedCategorySlugs.has(productCategorySlug);

      const matchesCategoryByIdOnly =
        selectedCategoryIds.includes(productCategoryId)
        && !productCategoryName
        && !productCategorySlug;

      const matchesCategory = matchesCategoryByNameOrSlug || matchesCategoryByIdOnly;
      if (!matchesCategory) return false;

      const isLaptopCategory = productCategoryName === 'laptops' || productCategorySlug === 'laptops';
      if (isLaptopCategory && !ALLOWED_LAPTOP_SKUS.has(String(product.sku || ''))) {
        return false;
      }

      if (selectedSubcategory) {
        if (product.subcategory !== selectedSubcategory) return false;
      }

      const stockQty = Number(product.stockQuantity ?? product.stock ?? 0);
      if (stockFilter === 'in-stock' && stockQty <= 0) return false;
      if (stockFilter === 'out-of-stock' && stockQty > 0) return false;

      if (!normalizedSearch) return true;
      return [product.name, product.brand, product.category?.name, product.category, product.sellerName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    });
  }, [products, categories, selectedCategoryIds, selectedSubcategory, searchTerm, stockFilter]);

  return (
    <div className="dashboard-page se-products-page">
      <TopNavbar />
     

      <CategoryNav />

      <section className="products-layout">
        <aside className="filter-panel" aria-label="Category filters">
          <h3>Filter by category</h3>

          <label className="se-products-filter-label">Search products</label>
          <input
            className="se-products-search"
            type="search"
            placeholder="Search by name, brand, seller..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <label className="se-products-filter-label">Stock filter</label>
          <select className="se-products-stock-filter" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

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
          <div className="se-products-result-head">
            <strong>{filteredProducts.length}</strong>
            <span>products found</span>
          </div>
          {isLoadingProducts ? <div className="loading-state">Loading products...</div> : null}
          {!isLoadingProducts && error ? <div className="empty-state">{error}</div> : null}
          {!isLoadingProducts && !error ? <ProductGrid products={filteredProducts} /> : null}
        </div>
      </section>
    </div>
  );
}

export default ProductsPage;
