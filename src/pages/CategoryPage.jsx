import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import TopNavbar from '../components/TopNavbar';
import { useShopData } from '../context/ShopDataContext';
import { addToCart, getLoggedInUser, getProductsByCategory } from '../services/api';

function CategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categoryById } = useShopData();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingProductId, setAddingProductId] = useState(null);

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
          {!isLoading && !error ? (
            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
              addingProductId={addingProductId}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default CategoryPage;
