import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createProduct, formatCurrencyINR, getCategories, getProducts } from '../../services/api';
import { useShopData } from '../../context/ShopDataContext';

const REQUIRED_CATEGORIES = [
  'Electronics',
  'Mobile Phones',
  'Laptops',
  'Tablets',
  'Accessories',
  'Clothing',
  'Mens Fashion',
  'Womens Fashion',
  'Kids Wear',
  'Footwear',
  'Sports Shoes',
  'Home Appliance',
  'Kitchen Appliance',
  'Furniture',
];

const normalizeCategoryName = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const getCategorySelectValue = (label, availableCategories) => {
  const matchedCategory = availableCategories.find(
    (category) => normalizeCategoryName(category.name) === normalizeCategoryName(label)
  );

  return matchedCategory ? String(matchedCategory.id) : `new:${label}`;
};

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '0',
  image_url: '',
  category_id: '',
  new_category_name: '',
};

function Products() {
  const { refreshCategories } = useShopData();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productList, categoryList] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productList);
      setCategories(categoryList);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load products.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedImageUrl = formData.image_url.trim();
    const trimmedNewCategory = formData.new_category_name.trim();
    const selectedCategoryValue = String(formData.category_id || '').trim();
    const stockValue = Number(formData.stock);

    if (!trimmedName) {
      toast.error('Product name is required.');
      return;
    }

    if (!formData.price) {
      toast.error('Product price is required.');
      return;
    }

    if (!Number.isFinite(stockValue) || stockValue < 0) {
      toast.error('Product stock must be zero or greater.');
      return;
    }

    setIsSaving(true);

    try {
      let resolvedCategoryId = 0;
      let resolvedNewCategoryName = trimmedNewCategory;

      if (!resolvedNewCategoryName && selectedCategoryValue) {
        if (selectedCategoryValue.startsWith('new:')) {
          resolvedNewCategoryName = selectedCategoryValue.slice(4).trim();
        } else {
          resolvedCategoryId = Number(selectedCategoryValue);
        }
      }

      if (!resolvedNewCategoryName && !resolvedCategoryId) {
        toast.error('Select an existing category or add a new one.');
        return;
      }

      await createProduct({
        name: trimmedName,
        description: trimmedDescription,
        price: Number(formData.price),
        stock: stockValue,
        image_url: trimmedImageUrl,
        category_id: resolvedNewCategoryName ? null : resolvedCategoryId,
        new_category_name: resolvedNewCategoryName || undefined,
      });

      await refreshCategories();
      toast.success('Product added successfully.');
      setFormData(emptyForm);
      setShowForm(false);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error adding product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <div>
          <h2>Products Management</h2>
          <p>Manage products and keep category references consistent with the database.</p>
        </div>
        <button
          type="button"
          className="admin-add-button"
          onClick={() => setShowForm((previous) => !previous)}
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm ? (
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Select Category *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required={!formData.new_category_name.trim()}
              disabled={Boolean(formData.new_category_name.trim())}
            >
              <option value="">Select Category</option>
              {REQUIRED_CATEGORIES.map((categoryName) => (
                <option key={categoryName} value={getCategorySelectValue(categoryName, categories)}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="new_category_name">Or Add New Category</label>
            <input
              id="new_category_name"
              name="new_category_name"
              type="text"
              value={formData.new_category_name}
              onChange={handleChange}
              placeholder="Create a new category"
            />
          </div>

          <button type="submit" className="admin-submit-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Add Product'}
          </button>
        </form>
      ) : null}

      <div className="admin-products-list">
        <h3>Existing Products</h3>
        {!products.length ? (
          <p>No products yet.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                {product.image_url || product.imageUrl ? (
                  <img
                    src={product.image_url || product.imageUrl}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                ) : null}
                <h4>{product.name}</h4>
                <p className="product-price">{formatCurrencyINR(product.price)}</p>
                <p className="product-category">Category: {product.category_name || product.category?.name}</p>
                <p className="product-description">{product.description || 'No description provided.'}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
