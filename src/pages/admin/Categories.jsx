import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createCategory, formatCurrencyINR, getCategories, getProductsByCategory } from '../../services/api';
import { useShopData } from '../../context/ShopDataContext';

function Categories() {
  const { refreshCategories } = useShopData();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (!selectedCategoryId) {
        setSelectedCategoryProducts([]);
        return;
      }

      try {
        setIsLoadingProducts(true);
        const data = await getProductsByCategory(selectedCategoryId);
        setSelectedCategoryProducts(data);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Unable to load products for the selected category.');
        setSelectedCategoryProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadCategoryProducts();
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load categories.');
    }
  };

  const handleAddCategory = async (event) => {
    event.preventDefault();

    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast.error('Category name is required.');
      return;
    }

    setIsSaving(true);

    try {
      const createdCategory = await createCategory(trimmedName);
      setCategories((previous) => [...previous, createdCategory]);
      await refreshCategories();
      setNewCategoryName('');
      toast.success('Category added successfully.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error adding category.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-categories-page">
      <h2>Categories Management</h2>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="categoryFilter">View Products by Category</label>
        <select
          id="categoryFilter"
          value={selectedCategoryId}
          onChange={(event) => setSelectedCategoryId(event.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-categories-list" style={{ marginBottom: '2rem' }}>
        <h3>Selected Category Products</h3>
        {!selectedCategoryId ? (
          <p>Please choose a category to view its products.</p>
        ) : isLoadingProducts ? (
          <p>Loading products...</p>
        ) : !selectedCategoryProducts.length ? (
          <p>No products found for this category.</p>
        ) : (
          <div className="products-grid">
            {selectedCategoryProducts.map((product) => (
              <article key={product.id} className="product-card">
                <h4>{product.name}</h4>
                <p className="product-price">{formatCurrencyINR(product.price)}</p>
                <p className="product-category">Category: {product.category_name || product.category?.name}</p>
                <p className="product-description">{product.description || 'No description provided.'}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <form className="admin-add-category-form" onSubmit={handleAddCategory}>
        <div className="form-group">
          <label htmlFor="categoryName">New Category Name</label>
          <input
            id="categoryName"
            type="text"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <button type="submit" className="admin-submit-button" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Add Category'}
        </button>
      </form>

      <div className="admin-categories-list">
        <h3>All Categories</h3>
        {!categories.length ? (
          <p>No categories yet.</p>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <h4>{category.name}</h4>
                <p>ID: {category.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
