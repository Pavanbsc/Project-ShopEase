import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { formatCurrencyINR, getProducts } from '../../services/api';

const LOW_STOCK_THRESHOLD = 5;

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadInventory = async () => {
      try {
        setIsLoading(true);
        const productList = await getProducts();

        if (isMounted) {
          setProducts(productList);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Unable to load inventory.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInventory();

    return () => {
      isMounted = false;
    };
  }, []);

  const totals = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const lowStockCount = products.filter((product) => Number(product.stock || 0) <= LOW_STOCK_THRESHOLD).length;

    return { totalProducts, totalStock, lowStockCount };
  }, [products]);

  return (
    <div className="admin-inventory-page">
      <div className="admin-products-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Inventory Management</h2>
          <p>Track product stock levels and spot items that need restocking.</p>
        </div>
      </div>

      <div
        className="inventory-summary"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="inventory-summary-card">
          <p>Total Products</p>
          <strong>{totals.totalProducts}</strong>
        </div>
        <div className="inventory-summary-card">
          <p>Total Stock</p>
          <strong>{totals.totalStock}</strong>
        </div>
        <div className="inventory-summary-card">
          <p>Low Stock Items</p>
          <strong>{totals.lowStockCount}</strong>
        </div>
      </div>

      <div className="inventory-table-wrap">
        {isLoading ? (
          <p>Loading inventory...</p>
        ) : products.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Product</th>
                  <th align="left">Category</th>
                  <th align="right">Price</th>
                  <th align="right">Stock</th>
                  <th align="left">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const stock = Number(product.stock || 0);
                  const isLowStock = stock <= LOW_STOCK_THRESHOLD;

                  return (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category_name || product.category?.name || 'Uncategorized'}</td>
                      <td align="right">{formatCurrencyINR(product.price)}</td>
                      <td align="right">{stock}</td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            backgroundColor: isLowStock ? '#fde68a' : '#d1fae5',
                            color: isLowStock ? '#92400e' : '#065f46',
                          }}
                        >
                          {isLowStock ? 'Low stock' : 'In stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No inventory items found yet. Add a product to see it here.</p>
        )}
      </div>
    </div>
  );
}
