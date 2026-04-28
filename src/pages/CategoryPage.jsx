import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import TopNavbar from '../components/TopNavbar';
import { useShopData } from '../context/ShopDataContext';
import { getProductsByCategory } from '../services/api';

function CategoryPage() {
  const { id } = useParams();
  const { categoryById } = useShopData();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const categoryProducts = await getProductsByCategory(id);
        setProducts(categoryProducts);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || 'Failed to load category products.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  const category = useMemo(() => categoryById[String(id)], [categoryById, id]);

  return (
    <div className="se-dashboard-page">
      <TopNavbar />

      <main className="se-main-content">
        <header className="se-section-head se-title-row">
          <div>
          <h1>{category?.name || `Category #${id}`}</h1>
          <p>{category?.description || 'Browse products within this category.'}</p>
          </div>
          <Link to="/home" className="status-link">
            Back to Home
          </Link>
        </header>

        <section className="se-home-section">
          <CategoryGrid activeCategoryId={id} />
        </section>

        <section className="se-home-section">
          {isLoading ? <div className="loading-state">Loading products...</div> : null}
          {!isLoading && error ? <div className="empty-state">{error}</div> : null}
          {!isLoading && !error ? <ProductGrid products={products} /> : null}
        </section>
      </main>
    </div>
  );
}

export default CategoryPage;
