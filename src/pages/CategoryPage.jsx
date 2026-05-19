
import React, { useEffect, useMemo } from 'react';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useShopData } from '../context/ShopDataContext';
import SubcategoryGrid from '../components/SubcategoryGrid';

function CategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();
  const { categoryBySlug } = useShopData();

  useEffect(() => {
    // If subcategory segment is present, redirect to filtered products
    if (subcategorySlug && categorySlug) {
      const category = categoryBySlug?.[categorySlug];
      if (category) {
        navigate(`/products?categoryId=${category.id}&subcategory=${subcategorySlug}`);
      } else {
        navigate('/products');
      }
    }
  }, [subcategorySlug, categorySlug, categoryBySlug, navigate]);

  const category = categoryBySlug?.[categorySlug];
  const breadcrumbLabel = useMemo(() => category?.name || 'Category', [category]);

  if (!categorySlug) {
    return <div className="empty-state">Category not specified.</div>;
  }

  if (!category) {
    return <div className="empty-state">Category not found.</div>;
  }

  // If no subcategories, go straight to products page filtered by category
  if (!Array.isArray(category.subcategories) || !category.subcategories.length) {
    navigate(`/products?categoryId=${category.id}`);
    return null;
  }

  return (
    <div className="se-minimal-page">
      <header className="se-minimal-header-bar">
        <nav className="se-minimal-header-content">
          <button type="button" className="se-minimal-header-home" onClick={() => navigate('/home')}>
            <FaHome />
          </button>
          <span className="se-minimal-header-title">{breadcrumbLabel}</span>
          <button type="button" className="se-minimal-header-back" onClick={() => navigate('/home')}>
            <FaArrowLeft />
            <span>Back</span>
          </button>
        </nav>
      </header>
      <main className="se-minimal-container">
        <section className="se-minimal-content">
          <div className="se-minimal-heading">
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            <a href="#subcategories" className="se-minimal-cta-link">View All</a>
          </div>

          <div id="subcategories">
            <SubcategoryGrid category={category} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default CategoryPage;
