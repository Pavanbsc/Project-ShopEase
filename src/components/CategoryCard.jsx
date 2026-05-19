import { Link } from 'react-router-dom';

function CategoryCard({ category }) {
  const categoryLabel = category?.name?.trim() || 'Category';
  const imageUrl = category?.image || null;
  const target = Array.isArray(category?.subcategories) && category.subcategories.length ? `/category/${category.slug}` : `/products?categoryId=${category.id}`;

  return (
    <Link to={target} className="category-card" aria-label={`Open ${categoryLabel}`}>
      <div className="category-card-icon" aria-hidden="true">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={categoryLabel}
            className="category-image"
            loading="lazy"
            draggable={false}
          />
        ) : (
          categoryLabel.charAt(0).toUpperCase()
        )}
      </div>
      <h3>{categoryLabel}</h3>
      <p>{category.description || 'Explore products in this category'}</p>
    </Link>
  );
}

export default CategoryCard;
