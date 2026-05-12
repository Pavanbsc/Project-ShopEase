import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createProduct, formatCurrencyINR, getCategories, getProducts, deleteProduct } from '../../services/api';
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
  // Product Information
  name: '',
  brand_name: '',
  category_id: '',
  new_category_name: '',
  description: '',

  // Pricing
  original_price: '',
  discount_percentage: 0,
  final_price: '',

  // Stock / Inventory
  stock: '0',
  stock_status: 'In Stock',

  // Product Images
  image_url: '',

  // Product Specifications
  specifications: {
    ram: '',
    storage: '',
    battery: '',
    material: '',
    size: '',
    weight: '',
    general: '',
  },

  // Seller Information
  seller: '',
  seller_rating: '',
  seller_type: 'Standard',
  seller_location: '',
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

    if (name.startsWith('spec_')) {
      const specKey = name.replace('spec_', '');
      setFormData((previous) => ({
        ...previous,
        specifications: {
          ...previous.specifications,
          [specKey]: value,
        },
      }));
    } else if (name === 'discount_percentage' || name === 'original_price') {
      const updated = { ...formData, [name]: value };

      if (name === 'discount_percentage' || name === 'original_price') {
        const origPrice = Number(name === 'original_price' ? value : formData.original_price) || 0;
        const discount = Number(name === 'discount_percentage' ? value : formData.discount_percentage) || 0;
        const finalPrice = origPrice - (origPrice * discount) / 100;
        updated.final_price = finalPrice.toFixed(2);
      }

      setFormData(updated);
    } else {
      setFormData((previous) => ({ ...previous, [name]: value }));
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully.');
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting product.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedBrandName = formData.brand_name.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedImageUrl = formData.image_url.trim();
    const trimmedNewCategory = formData.new_category_name.trim();
    const trimmedSeller = formData.seller.trim();
    const trimmedSellerLocation = formData.seller_location.trim();
    const selectedCategoryValue = String(formData.category_id || '').trim();
    const stockValue = Number(formData.stock);
    const originalPrice = Number(formData.original_price) || 0;
    const finalPrice = Number(formData.final_price) || 0;
    const discountPercentage = Number(formData.discount_percentage) || 0;
    const sellerRating = Number(formData.seller_rating) || 0;

    if (!trimmedName) {
      toast.error('Product name is required.');
      return;
    }

    if (!trimmedSeller) {
      toast.error('Seller name is required.');
      return;
    }

    if (!finalPrice || finalPrice <= 0) {
      toast.error('Product final price must be greater than 0.');
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

      // Filter out empty specification values
      const specifications = {};
      Object.entries(formData.specifications).forEach(([key, value]) => {
        if (value && String(value).trim()) {
          specifications[key] = String(value).trim();
        }
      });

      await createProduct({
        name: trimmedName,
        brand_name: trimmedBrandName || undefined,
        description: trimmedDescription,
        price: finalPrice,
        final_price: finalPrice,
        original_price: originalPrice || undefined,
        discount_percentage: discountPercentage,
        stock: stockValue,
        stock_status: stockValue > 0 ? 'In Stock' : 'Out of Stock',
        image_url: trimmedImageUrl,
        seller: trimmedSeller,
        seller_rating: sellerRating || undefined,
        seller_type: formData.seller_type,
        seller_location: trimmedSellerLocation || undefined,
        specifications: specifications,
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
          <p>Manage products with comprehensive details including pricing, specifications, and seller info.</p>
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
          {/* Product Information Section */}
          <fieldset className="form-section">
            <legend>🔷 Product Information</legend>

            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., iPhone 15 Pro Max"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand_name">Brand Name</label>
              <input
                id="brand_name"
                name="brand_name"
                type="text"
                value={formData.brand_name}
                onChange={handleChange}
                placeholder="e.g., Apple"
              />
            </div>

            <div className="form-row">
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
            </div>

            <div className="form-group">
              <label htmlFor="description">Product Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed product description..."
              />
            </div>
          </fieldset>

          {/* Pricing Section */}
          <fieldset className="form-section">
            <legend>🔷 Pricing</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="original_price">Original Price</label>
                <input
                  id="original_price"
                  name="original_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.original_price}
                  onChange={handleChange}
                  placeholder="MRP"
                />
              </div>

              <div className="form-group">
                <label htmlFor="discount_percentage">Discount % </label>
                <input
                  id="discount_percentage"
                  name="discount_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="final_price">Final Selling Price *</label>
                <input
                  id="final_price"
                  name="final_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.final_price}
                  onChange={handleChange}
                  placeholder="Calculated or enter manually"
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Stock / Inventory Section */}
          <fieldset className="form-section">
            <legend>🔷 Stock / Inventory</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stock">Available Quantity *</label>
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
                <label htmlFor="stock_status">Stock Status</label>
                <select
                  id="stock_status"
                  name="stock_status"
                  value={formData.stock_status}
                  onChange={handleChange}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Product Images Section */}
          <fieldset className="form-section">
            <legend>🔷 Product Images</legend>

            <div className="form-group">
              <label htmlFor="image_url">Main Product Image URL</label>
              <input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <p className="form-hint">Note: Additional product images feature coming soon.</p>
          </fieldset>

          {/* Product Specifications Section */}
          <fieldset className="form-section">
            <legend>🔷 Product Specifications</legend>

            <div className="form-group">
              <label htmlFor="spec_ram">RAM / Memory</label>
              <input
                id="spec_ram"
                name="spec_ram"
                type="text"
                value={formData.specifications.ram}
                onChange={handleChange}
                placeholder="e.g., 8GB"
              />
            </div>

            <div className="form-group">
              <label htmlFor="spec_storage">Storage / Capacity</label>
              <input
                id="spec_storage"
                name="spec_storage"
                type="text"
                value={formData.specifications.storage}
                onChange={handleChange}
                placeholder="e.g., 256GB SSD"
              />
            </div>

            <div className="form-group">
              <label htmlFor="spec_battery">Battery / Power</label>
              <input
                id="spec_battery"
                name="spec_battery"
                type="text"
                value={formData.specifications.battery}
                onChange={handleChange}
                placeholder="e.g., 5000mAh"
              />
            </div>

            <div className="form-group">
              <label htmlFor="spec_material">Material</label>
              <input
                id="spec_material"
                name="spec_material"
                type="text"
                value={formData.specifications.material}
                onChange={handleChange}
                placeholder="e.g., Stainless Steel"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="spec_size">Size / Dimensions</label>
                <input
                  id="spec_size"
                  name="spec_size"
                  type="text"
                  value={formData.specifications.size}
                  onChange={handleChange}
                  placeholder="e.g., 15.4 inches"
                />
              </div>

              <div className="form-group">
                <label htmlFor="spec_weight">Weight</label>
                <input
                  id="spec_weight"
                  name="spec_weight"
                  type="text"
                  value={formData.specifications.weight}
                  onChange={handleChange}
                  placeholder="e.g., 500g"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="spec_general">General Specifications</label>
              <textarea
                id="spec_general"
                name="spec_general"
                rows="2"
                value={formData.specifications.general}
                onChange={handleChange}
                placeholder="Any other specifications..."
              />
            </div>
          </fieldset>

          {/* Seller Information Section */}
          <fieldset className="form-section">
            <legend>🔷 Seller Information</legend>

            <div className="form-group">
              <label htmlFor="seller">Seller / Store Name *</label>
              <input
                id="seller"
                name="seller"
                type="text"
                value={formData.seller}
                onChange={handleChange}
                placeholder="e.g., Amazon, Flipkart, Best Deals"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="seller_rating">Seller Rating (0-5)</label>
                <input
                  id="seller_rating"
                  name="seller_rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.seller_rating}
                  onChange={handleChange}
                  placeholder="4.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="seller_type">Seller Type</label>
                <select
                  id="seller_type"
                  name="seller_type"
                  value={formData.seller_type}
                  onChange={handleChange}
                >
                  <option value="Standard">Standard</option>
                  <option value="Verified">Verified</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="seller_location">Seller Location</label>
              <input
                id="seller_location"
                name="seller_location"
                type="text"
                value={formData.seller_location}
                onChange={handleChange}
                placeholder="e.g., Mumbai, India"
              />
            </div>
          </fieldset>

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
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                ) : null}
                <h4>{product.name}</h4>
                {product.brand_name && <p className="product-brand">Brand: {product.brand_name}</p>}
                <p className="product-price">{formatCurrencyINR(product.final_price || product.price)}</p>
                {product.discount_percentage > 0 && (
                  <p className="product-discount">{product.discount_percentage}% OFF</p>
                )}
                <p className="product-category">Category: {product.category_name}</p>
                <p className="product-seller">Seller: {product.seller}</p>
                {product.seller_rating && <p className="product-rating">Rating: {product.seller_rating}⭐</p>}
                <p className="product-stock">Stock: {product.stock}</p>
                <p className="product-description">{product.description || 'No description provided.'}</p>
                <button
                  type="button"
                  className="admin-delete-button"
                  onClick={() => handleDelete(product.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
