import { Link } from 'react-router-dom';

function CategoryCard({ category }) {
  const categoryLabel = category?.name?.trim() || 'Category';
  const token = categoryLabel.charAt(0).toUpperCase();

  return (
    <Link to={`/category/${category.id}`} className="category-card" aria-label={`Open ${categoryLabel}`}>
      <div className="category-card-icon" aria-hidden="true">
        {token}
      </div>
      <h3>{categoryLabel}</h3>
      <p>{category.description || 'Explore products in this category'}</p>
    </Link>
  );
}

export default CategoryCard;
