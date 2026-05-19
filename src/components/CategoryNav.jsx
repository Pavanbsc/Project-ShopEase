import { Link, useLocation } from 'react-router-dom';
import { FaListUl, FaStore } from 'react-icons/fa';
import { useShopData } from '../context/ShopDataContext';

function CategoryNav() {
  const location = useLocation();
  const { categories, isLoadingCategories } = useShopData();

  const isProductsRoute = location.pathname === '/products';

  return (
    <section className="category-nav-shell" aria-label="Category navigation">
      <div className="category-nav">
        <Link to="/home" className={`category-pill ${location.pathname === '/home' ? 'active' : ''}`}>
          <FaStore />
          Home
        </Link>

        <Link to="/products" className={`category-pill ${isProductsRoute ? 'active' : ''}`}>
          <FaListUl />
          All Products
        </Link>

        {isLoadingCategories ? (
          <span className="category-pill loading">Loading categories...</span>
        ) : (
          categories.map((category) => {
            const target = Array.isArray(category?.subcategories) && category.subcategories.length ? `/category/${category.slug}` : `/products?categoryId=${category.id}`;
            const isActive =
              location.pathname.startsWith(`/category/${category.slug}`) ||
              (location.pathname === '/products' && new URLSearchParams(location.search).get('categoryId') === String(category.id));

            return (
              <Link key={category.id} to={target} className={`category-pill ${isActive ? 'active' : ''}`}>
                {category.name}
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}

export default CategoryNav;
