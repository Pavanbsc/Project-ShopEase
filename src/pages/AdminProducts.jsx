import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../services/api';
import '../styles/admin.css';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProducts()
      .then((data) => mounted && setProducts(Array.isArray(data) ? data : []))
      .catch((e) => mounted && setError(e?.response?.data?.message || e?.message || 'Unable to load products'))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div className="admin-container users-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Products</h2>
          <div style={{ color: 'var(--muted)' }}>Manage catalog, variants and inventory</div>
        </div>
        <div>
          <Link to="/admin-products/add" className="btn-primary">Add Product</Link>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : <ProductGrid products={products} />}
      </div>
    </div>
  );
}

export default AdminProducts;
