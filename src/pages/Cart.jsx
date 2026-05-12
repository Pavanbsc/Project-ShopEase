import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { formatCurrencyINR, getCartForUser, getLoggedInUser, getProducts } from '../services/api';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError('');

        const user = getLoggedInUser();
        if (!user?.id) {
          navigate('/login');
          return;
        }

        const [cart, productList] = await Promise.all([getCartForUser(user.id), getProducts()]);
        setCartItems(cart.items || []);
        setProducts(productList);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || 'Unable to load your cart.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  const cartLines = useMemo(() => {
    return cartItems.map((item) => {
      const product = products.find((entry) => Number(entry.id) === Number(item.productId));
      return {
        ...item,
        product,
        lineTotal: Number(product?.price || 0) * Number(item.quantity || 0),
      };
    });
  }, [cartItems, products]);

  const cartTotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + Number(line.lineTotal || 0), 0),
    [cartLines]
  );

  return (
    <div className="se-dashboard-page">
      <TopNavbar />
      <main className="se-main-content">
        <section className="se-home-section">
          <div className="se-section-head se-title-row">
            <div>
              <h1>Your Cart</h1>
              <p>Items you add to cart will appear here.</p>
            </div>
          </div>
          {isLoading ? <div className="loading-state">Loading cart...</div> : null}
          {!isLoading && error ? <div className="empty-state">{error}</div> : null}
          {!isLoading && !error && !cartLines.length ? (
            <div className="empty-state">Your cart is empty. Start shopping from categories above.</div>
          ) : null}
          {!isLoading && !error && cartLines.length ? (
            <div className="cart-list" style={{ display: 'grid', gap: '14px' }}>
              {cartLines.map((line) => (
                <article
                  key={`${line.productId}-${line.id}`}
                  className="product-card"
                  style={{ display: 'grid', gap: '8px' }}
                >
                  <div className="product-card-top">
                    <p className="product-category">
                      {line.product?.category_name || line.product?.category?.name || 'Uncategorized'}
                    </p>
                    <span className="stock-pill in-stock">Qty {line.quantity}</span>
                  </div>
                  <h3>{line.product?.name || `Product #${line.productId}`}</h3>
                  <p>{line.product?.description || 'Cart item saved in your account.'}</p>
                  <div className="price-row">
                    <strong>{formatCurrencyINR(line.product?.price)}</strong>
                  </div>
                  <div className="price-row" style={{ marginTop: 0 }}>
                    <strong>Line total: {formatCurrencyINR(line.lineTotal)}</strong>
                  </div>
                </article>
              ))}
              <div className="product-card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Cart Total</strong>
                <strong>{formatCurrencyINR(cartTotal)}</strong>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default Cart;
