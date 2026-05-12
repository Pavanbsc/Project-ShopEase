import { useState } from 'react';
import { FaChevronDown, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { buildCategoryProductUrl } from './homeCategories';

function CategoryCard({ category }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const Icon = category.icon;
  const hasSubcategories = Array.isArray(category.subcategories) && category.subcategories.length > 0;

  const handlePrimaryAction = () => {
    navigate(buildCategoryProductUrl(category.name));
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(buildCategoryProductUrl(category.name, subcategory));
  };

  return (
    <article className={`home-category-card ${isOpen ? 'is-open' : ''}`} style={{ '--card-accent': category.accent }}>
      <div className="home-category-card__header-row">
        <button type="button" className="home-category-card__header" onClick={handlePrimaryAction}>
          <span className="home-category-card__icon" aria-hidden="true">
            <Icon />
          </span>
          <span className="home-category-card__content">
            <span className="home-category-card__name">{category.name}</span>
            <span className="home-category-card__description">{category.description}</span>
          </span>
        </button>

        {hasSubcategories ? (
          <button
            type="button"
            className="home-category-card__toggle"
            onClick={() => setIsOpen((previous) => !previous)}
            aria-expanded={isOpen}
            aria-label={isOpen ? `Collapse ${category.name} subcategories` : `Expand ${category.name} subcategories`}
          >
            <span className="home-category-card__chevron" aria-hidden="true">
              <FaChevronDown />
            </span>
          </button>
        ) : (
          <span className="home-category-card__toggle home-category-card__toggle--static" aria-hidden="true">
            <FaArrowRight />
          </span>
        )}
      </div>

      {hasSubcategories ? (
        <div className="home-category-card__body">
          <div className="home-category-chip-list" role="list" aria-label={`${category.name} subcategories`}>
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory}
                type="button"
                className="home-category-chip"
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                {subcategory}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default CategoryCard;
