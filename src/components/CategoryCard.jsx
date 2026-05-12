import { Link } from 'react-router-dom';

function CategoryCard({ category }) {
  const categoryLabel = category?.name?.trim() || 'Category';
  const imageUrl = category?.image || null;

  return (
    <Link to={`/category/${category.id}`} className="category-card" aria-label={`Open ${categoryLabel}`}>
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
