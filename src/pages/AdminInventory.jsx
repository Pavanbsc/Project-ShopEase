import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBoxOpen,
  FaEdit,
  FaEye,
  FaFilter,
  FaMinusCircle,
  FaPlusCircle,
  FaSearch,
  FaSortAmountDown,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
  FaWarehouse,
} from 'react-icons/fa';
import {
  deleteProductById,
  getInventoryProducts,
  setProductActive,
  updateProduct,
  updateProductStock,
} from '../services/api';
import '../styles/admin-inventory.css';

const PAGE_SIZE = 10;

const getStockIndicator = (product) => {
  const qty = Number(product.stockQuantity ?? product.stock ?? 0);
  if (qty <= 0) return { label: 'Out of Stock', tone: 'out' };
  if (qty <= 10) return { label: 'Low Stock', tone: 'low' };
  return { label: 'In Stock', tone: 'in' };
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const parseImageList = (value) =>
  String(value || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const toPayload = (product, overrides = {}) => {
  const merged = { ...product, ...overrides };
  const categoryName = typeof merged.category === 'object' ? merged.category?.name : merged.category;
  const categoryId = merged.categoryId ?? merged.category?.id ?? null;

  return {
    id: merged.id,
    categoryId,
    categorySlug: merged.categorySlug,
    name: merged.name,
    brand: merged.brand,
    category: categoryName,
    subcategory: merged.subcategory,
    description: merged.description,
    originalPrice: Number(merged.originalPrice ?? merged.price ?? 0),
    discountPercent: Number(merged.discountPercent ?? 0),
    price: Number(merged.price ?? merged.finalPrice ?? 0),
    currency: merged.currency || 'INR',
    stockQuantity: Number(merged.stockQuantity ?? merged.stock ?? 0),
    stockStatus: getStockIndicator(merged).label,
    sku: merged.sku,
    sellerType: merged.sellerType || merged.seller?.type,
    sellerLocation: merged.sellerLocation || merged.seller?.location,
    images: merged.images || [],
    specifications: merged.specifications || {},
    variants: merged.variants || [],
    sellerId: merged.sellerId,
    sellerName: merged.sellerName || merged.seller?.name,
    deliveryInfo: merged.deliveryInfo || {},
    warranty: merged.warranty,
    returnPolicy: merged.returnPolicy,
    tags: merged.tags || [],
    active: merged.active !== false,
  };
};

function AdminInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedDesc');
  const [currentPage, setCurrentPage] = useState(1);

  const [viewProduct, setViewProduct] = useState(null);
  const [stockModal, setStockModal] = useState({ open: false, product: null, stockQuantity: 0, saving: false });
  const [editModal, setEditModal] = useState({
    open: false,
    product: null,
    saving: false,
    form: {
      name: '',
      brand: '',
      category: '',
      price: '',
      stockQuantity: '',
      sellerName: '',
      imagesText: '',
    },
  });
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', action: null, danger: false, loading: false });

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getInventoryProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || apiError?.message || 'Unable to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const categories = useMemo(() => {
    const values = new Set();
    products.forEach((product) => {
      const name = typeof product.category === 'object' ? product.category?.name : product.category;
      if (name) values.add(name);
    });
    return [...values].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const summary = useMemo(() => {
    const totalProducts = products.length;
    const lowStockItems = products.filter((item) => Number(item.stockQuantity ?? item.stock ?? 0) > 0 && Number(item.stockQuantity ?? item.stock ?? 0) <= 10).length;
    const outOfStockItems = products.filter((item) => Number(item.stockQuantity ?? item.stock ?? 0) <= 0).length;
    const totalInventoryValue = products.reduce((acc, item) => {
      const qty = Number(item.stockQuantity ?? item.stock ?? 0);
      const price = Number(item.price ?? item.finalPrice ?? 0);
      return acc + qty * price;
    }, 0);
    return { totalProducts, lowStockItems, outOfStockItems, totalInventoryValue };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
      const matchesCategory = categoryFilter === 'all' || categoryName === categoryFilter;
      const matchesSearch = !normalizedSearch
        || String(product.name || '').toLowerCase().includes(normalizedSearch)
        || String(product.brand || '').toLowerCase().includes(normalizedSearch)
        || String(product.sellerName || product.seller?.name || '').toLowerCase().includes(normalizedSearch)
        || String(product.sku || '').toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nameAsc':
          return String(a.name || '').localeCompare(String(b.name || ''));
        case 'nameDesc':
          return String(b.name || '').localeCompare(String(a.name || ''));
        case 'priceAsc':
          return Number(a.price ?? a.finalPrice ?? 0) - Number(b.price ?? b.finalPrice ?? 0);
        case 'priceDesc':
          return Number(b.price ?? b.finalPrice ?? 0) - Number(a.price ?? a.finalPrice ?? 0);
        case 'stockAsc':
          return Number(a.stockQuantity ?? a.stock ?? 0) - Number(b.stockQuantity ?? b.stock ?? 0);
        case 'stockDesc':
          return Number(b.stockQuantity ?? b.stock ?? 0) - Number(a.stockQuantity ?? a.stock ?? 0);
        case 'updatedAsc':
          return new Date(a.updatedAt || a.createdAt || 0).getTime() - new Date(b.updatedAt || b.createdAt || 0).getTime();
        case 'updatedDesc':
        default:
          return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
      }
    });
  }, [products, categoryFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const openEdit = (product) => {
    setEditModal({
      open: true,
      product,
      saving: false,
      form: {
        name: product.name || '',
        brand: product.brand || '',
        category: typeof product.category === 'object' ? product.category?.name || '' : product.category || '',
        price: String(product.price ?? product.finalPrice ?? ''),
        stockQuantity: String(product.stockQuantity ?? product.stock ?? 0),
        sellerName: product.sellerName || product.seller?.name || '',
        imagesText: Array.isArray(product.images) ? product.images.join('\n') : '',
      },
    });
  };

  const saveEdit = async () => {
    if (!editModal.product) return;
    try {
      setEditModal((prev) => ({ ...prev, saving: true }));
      const payload = toPayload(editModal.product, {
        name: editModal.form.name.trim(),
        brand: editModal.form.brand.trim(),
        category: editModal.form.category.trim(),
        price: Number(editModal.form.price || 0),
        stockQuantity: Number(editModal.form.stockQuantity || 0),
        sellerName: editModal.form.sellerName.trim(),
        images: parseImageList(editModal.form.imagesText),
      });
      const updated = await updateProduct(editModal.product.id, payload);
      setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditModal((prev) => ({ ...prev, open: false, saving: false }));
    } catch (apiError) {
      setError(apiError?.response?.data?.message || apiError?.message || 'Unable to update product');
      setEditModal((prev) => ({ ...prev, saving: false }));
    }
  };

  const openStockUpdate = (product) => {
    setStockModal({
      open: true,
      product,
      stockQuantity: Number(product.stockQuantity ?? product.stock ?? 0),
      saving: false,
    });
  };

  const saveStock = async () => {
    if (!stockModal.product) return;
    try {
      setStockModal((prev) => ({ ...prev, saving: true }));
      const updated = await updateProductStock(stockModal.product.id, Number(stockModal.stockQuantity || 0));
      setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setStockModal((prev) => ({ ...prev, open: false, saving: false }));
    } catch (apiError) {
      setError(apiError?.response?.data?.message || apiError?.message || 'Unable to update stock');
      setStockModal((prev) => ({ ...prev, saving: false }));
    }
  };

  const openConfirm = (title, message, action, danger = false) => {
    setConfirmModal({ open: true, title, message, action, danger, loading: false });
  };

  const runConfirm = async () => {
    if (!confirmModal.action) return;
    try {
      setConfirmModal((prev) => ({ ...prev, loading: true }));
      await confirmModal.action();
      setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
    } catch (apiError) {
      setError(apiError?.response?.data?.message || apiError?.message || 'Action failed');
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleToggleActive = (product) => {
    const nextActive = product.active === false;
    openConfirm(
      nextActive ? 'Enable Product' : 'Disable Product',
      nextActive
        ? 'This product will be visible to users in the storefront again.'
        : 'This product will be hidden from users but kept in inventory.',
      async () => {
        const updated = await setProductActive(product.id, nextActive);
        setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      },
      !nextActive,
    );
  };

  const handleDelete = (product) => {
    openConfirm(
      'Delete Product',
      'This action cannot be undone. Do you want to permanently delete this product?',
      async () => {
        await deleteProductById(product.id);
        setProducts((prev) => prev.filter((item) => item.id !== product.id));
      },
      true,
    );
  };

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li><Link to="/admin-dashboard">Dashboard</Link></li>
            <li><Link to="/admin-products">Products</Link></li>
            <li><Link to="/admin-users">Users</Link></li>
            <li className="active"><Link to="/admin-inventory">Inventory</Link></li>
          </ul>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="brand">ShopEase Admin</div>
          <button className="btn-logout" onClick={() => navigate('/login')}>Logout</button>
        </header>

        <section className="admin-container inventory-page">
          <div className="inventory-title-row">
            <div>
              <h1>Inventory Management</h1>
              <p className="lead">Professional stock operations, live product controls, and inventory insights.</p>
            </div>
            <Link to="/admin-products/add" className="inventory-add-btn">Add Product</Link>
          </div>

          <div className="inventory-summary-grid">
            <article className="inventory-summary-card">
              <div className="inventory-summary-icon"><FaBoxOpen /></div>
              <div>
                <p>Total Products</p>
                <h3>{summary.totalProducts}</h3>
              </div>
            </article>
            <article className="inventory-summary-card">
              <div className="inventory-summary-icon low"><FaMinusCircle /></div>
              <div>
                <p>Low Stock Items</p>
                <h3>{summary.lowStockItems}</h3>
              </div>
            </article>
            <article className="inventory-summary-card">
              <div className="inventory-summary-icon out"><FaWarehouse /></div>
              <div>
                <p>Out of Stock Items</p>
                <h3>{summary.outOfStockItems}</h3>
              </div>
            </article>
            <article className="inventory-summary-card">
              <div className="inventory-summary-icon value"><FaPlusCircle /></div>
              <div>
                <p>Total Inventory Value</p>
                <h3>{formatCurrency(summary.totalInventoryValue)}</h3>
              </div>
            </article>
          </div>

          <div className="inventory-toolbar">
            <label className="inventory-search">
              <FaSearch />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search product, brand, SKU, seller..."
              />
            </label>

            <label className="inventory-filter">
              <FaFilter />
              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="inventory-filter">
              <FaSortAmountDown />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="updatedDesc">Last Updated (Newest)</option>
                <option value="updatedAsc">Last Updated (Oldest)</option>
                <option value="nameAsc">Name (A-Z)</option>
                <option value="nameDesc">Name (Z-A)</option>
                <option value="priceAsc">Price (Low to High)</option>
                <option value="priceDesc">Price (High to Low)</option>
                <option value="stockAsc">Stock (Low to High)</option>
                <option value="stockDesc">Stock (High to Low)</option>
              </select>
            </label>
          </div>

          {error ? <div className="inventory-error">{error}</div> : null}

          <div className="inventory-table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Available Stock</th>
                  <th>Stock Status</th>
                  <th>Seller</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="inventory-empty">Loading inventory...</td>
                  </tr>
                ) : null}

                {!loading && !pagedProducts.length ? (
                  <tr>
                    <td colSpan={9} className="inventory-empty">No inventory records found for this filter.</td>
                  </tr>
                ) : null}

                {!loading && pagedProducts.map((product) => {
                  const stock = getStockIndicator(product);
                  const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
                  const imageUrl = product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/56x56?text=NA';
                  return (
                    <tr key={product.id} className={!product.active ? 'row-disabled' : ''}>
                      <td>
                        <div className="inventory-product-cell">
                          <img src={imageUrl} alt={product.name} />
                          <div>
                            <strong>{product.name}</strong>
                            <small>{product.sku || 'SKU not available'}</small>
                            {!product.active ? <span className="disabled-pill">Disabled</span> : null}
                          </div>
                        </div>
                      </td>
                      <td>{product.brand || '—'}</td>
                      <td>{categoryName || '—'}</td>
                      <td>{formatCurrency(product.price ?? product.finalPrice)}</td>
                      <td>{Number(product.stockQuantity ?? product.stock ?? 0)}</td>
                      <td>
                        <span className={`stock-pill ${stock.tone}`}>{stock.label}</span>
                      </td>
                      <td>{product.sellerName || product.seller?.name || '—'}</td>
                      <td>{formatDateTime(product.updatedAt || product.createdAt)}</td>
                      <td>
                        <div className="inventory-actions">
                          <button title="Edit" onClick={() => openEdit(product)}><FaEdit /></button>
                          <button title="Update Stock" onClick={() => openStockUpdate(product)}><FaWarehouse /></button>
                          <button title="View Product" onClick={() => setViewProduct(product)}><FaEye /></button>
                          <button
                            title={product.active ? 'Disable' : 'Enable'}
                            onClick={() => handleToggleActive(product)}
                          >
                            {product.active ? <FaToggleOff /> : <FaToggleOn />}
                          </button>
                          <button title="Delete" className="danger" onClick={() => handleDelete(product)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="inventory-pagination">
            <div>
              Showing {pagedProducts.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} - {(currentPage - 1) * PAGE_SIZE + pagedProducts.length} of {filteredProducts.length}
            </div>
            <div className="inventory-pagination-actions">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Previous</button>
              <span>Page {currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </div>
        </section>
      </div>

      {viewProduct ? (
        <div className="inventory-modal-backdrop" onClick={() => setViewProduct(null)}>
          <div className="inventory-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Product Details</h3>
            <p className="inventory-modal-sub">{viewProduct.name}</p>
            <div className="inventory-detail-grid">
              <span>Brand</span><strong>{viewProduct.brand || '—'}</strong>
              <span>Category</span><strong>{typeof viewProduct.category === 'object' ? viewProduct.category?.name : viewProduct.category || '—'}</strong>
              <span>Price</span><strong>{formatCurrency(viewProduct.price ?? viewProduct.finalPrice)}</strong>
              <span>Stock</span><strong>{Number(viewProduct.stockQuantity ?? viewProduct.stock ?? 0)}</strong>
              <span>Seller</span><strong>{viewProduct.sellerName || viewProduct.seller?.name || '—'}</strong>
              <span>Location</span><strong>{viewProduct.sellerLocation || viewProduct.seller?.location || '—'}</strong>
              <span>Last Updated</span><strong>{formatDateTime(viewProduct.updatedAt || viewProduct.createdAt)}</strong>
              <span>Description</span><strong>{viewProduct.description || 'No description'}</strong>
            </div>
            <div className="inventory-modal-actions">
              <button onClick={() => setViewProduct(null)}>Close</button>
            </div>
          </div>
        </div>
      ) : null}

      {stockModal.open ? (
        <div className="inventory-modal-backdrop" onClick={() => setStockModal((prev) => ({ ...prev, open: false }))}>
          <div className="inventory-modal small" onClick={(event) => event.stopPropagation()}>
            <h3>Update Stock</h3>
            <p className="inventory-modal-sub">{stockModal.product?.name}</p>
            <label className="inventory-field">
              New Stock Quantity
              <input
                type="number"
                min={0}
                value={stockModal.stockQuantity}
                onChange={(event) => setStockModal((prev) => ({ ...prev, stockQuantity: event.target.value }))}
              />
            </label>
            <div className="inventory-modal-actions">
              <button onClick={() => setStockModal((prev) => ({ ...prev, open: false }))}>Cancel</button>
              <button className="primary" onClick={saveStock} disabled={stockModal.saving}>{stockModal.saving ? 'Saving...' : 'Update Stock'}</button>
            </div>
          </div>
        </div>
      ) : null}

      {editModal.open ? (
        <div className="inventory-modal-backdrop" onClick={() => setEditModal((prev) => ({ ...prev, open: false }))}>
          <div className="inventory-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Edit Product</h3>
            <p className="inventory-modal-sub">{editModal.product?.name}</p>
            <div className="inventory-form-grid">
              <label className="inventory-field">Product Name
                <input value={editModal.form.name} onChange={(event) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, name: event.target.value } }))} />
              </label>
              <label className="inventory-field">Brand
                <input value={editModal.form.brand} onChange={(event) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, brand: event.target.value } }))} />
              </label>
              <label className="inventory-field">Category
                <input value={editModal.form.category} onChange={(event) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, category: event.target.value } }))} />
              </label>
              <label className="inventory-field">Price (₹)
                <input type="number" min={0} value={editModal.form.price} onChange={(event) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, price: event.target.value } }))} />
              </label>
              <label className="inventory-field">Stock
                <input type="number" min={0} value={editModal.form.stockQuantity} onChange={(event) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, stockQuantity: event.target.value } }))} />
              </label>
              <label className="inventory-field">Seller Name
                <input value={editModal.form.sellerName} onChange={(event) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, sellerName: event.target.value } }))} />
              </label>
              <label className="inventory-field inventory-field--full">Product Images
                <textarea
                  rows={4}
                  value={editModal.form.imagesText}
                  onChange={(event) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, imagesText: event.target.value } }))}
                  placeholder="Enter one image path or URL per line, for example:\n/products/asus-tuf-gaming-f15/main.jpg"
                />
                <small>Clear this field to remove existing images. Add new paths to replace them.</small>
              </label>
            </div>
            <div className="inventory-modal-actions">
              <button onClick={() => setEditModal((prev) => ({ ...prev, open: false }))}>Cancel</button>
              <button className="primary" onClick={saveEdit} disabled={editModal.saving}>{editModal.saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmModal.open ? (
        <div className="inventory-modal-backdrop" onClick={() => setConfirmModal((prev) => ({ ...prev, open: false }))}>
          <div className="inventory-modal small" onClick={(event) => event.stopPropagation()}>
            <h3>{confirmModal.title}</h3>
            <p className="inventory-modal-sub">{confirmModal.message}</p>
            <div className="inventory-modal-actions">
              <button onClick={() => setConfirmModal((prev) => ({ ...prev, open: false }))}>Cancel</button>
              <button className={confirmModal.danger ? 'danger' : 'primary'} onClick={runConfirm} disabled={confirmModal.loading}>
                {confirmModal.loading ? 'Please wait...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminInventory;
