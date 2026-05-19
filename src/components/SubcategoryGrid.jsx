import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SUBCATEGORY_COPY = {
  Audio: 'Immersive sound, headphones, speakers, and more.',
  Cameras: 'Capture moments with premium imaging gear.',
  Gaming: 'Consoles, accessories, and elite gaming gear.',
  'Smart Devices': 'Connected devices built for smart living.',
  Accessories: 'Essentials and add-ons to complete your setup.',
  Men: 'Stylish essentials tailored for modern menswear.',
  Women: 'Refined fashion picks with premium finish.',
  Kids: 'Comfortable, playful, and everyday-friendly choices.',
  Footwear: 'Step into comfort with curated footwear.',
  Kitchen: 'Elegant tools and appliances for everyday cooking.',
  Furniture: 'Modern pieces for home comfort and style.',
  'Home Decor': 'Elevate spaces with tasteful decor accents.',
  Storage: 'Smart organizing solutions for cleaner spaces.',
  Lighting: 'Warm, modern lighting for every room.',
  Skincare: 'Daily essentials for a healthy glow and care.',
  Haircare: 'Nourishing products for polished hair routines.',
  Makeup: 'Beauty-forward picks for expressive looks.',
  Fragrances: 'Signature scents with refined finishing notes.',
  'Fitness Equipment': 'Train stronger with premium fitness gear.',
  Sportswear: 'Performance-ready pieces for active days.',
  'Outdoor Sports': 'Adventure-ready products for open-air activity.',
  'Indoor Games': 'Fun indoor picks for effortless entertainment.',
  'Car Accessories': 'Drive in style with polished car essentials.',
  'Bike Accessories': 'Ride-ready accessories for bike enthusiasts.',
  Maintenance: 'Care and upkeep tools for long-lasting performance.',
  Safety: 'Smart safety gear for a more secure ride.',
  'Men’s Watches': 'Classic designs with premium masculine appeal.',
  'Women’s Watches': 'Elegant timepieces with a refined silhouette.',
  'Smart Watches': 'Connected style with fitness and notifications.',
  'Sports Watches': 'Durable performance for active lifestyles.',
  'Kids Watches': 'Fun, colorful, and easy-to-read timepieces.',
};

const cardGradientPairs = [
  ['#667eea', '#764ba2'],
  ['#0ea5e9', '#2563eb'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#0f766e'],
  ['#8b5cf6', '#ec4899'],
  ['#0f172a', '#334155'],
];

const resolveSubcategoryImage = (sub) => sub?.image || sub?.imageUrl || sub?.thumbnail || sub?.icon || sub?.iconUrl || '';

function SubcategoryGrid({ category }) {
  const navigate = useNavigate();
  const subcategories = category?.subcategories || [];

  if (!subcategories.length) {
    return <div className="empty-state">No subcategories available.</div>;
  }

  return (
    <div className="se-minimal-grid-wrap">
      <div className="se-minimal-grid" aria-label={`Subcategories for ${category.name}`}>
        {subcategories.map((sub, idx) => {
          const imageSrc = resolveSubcategoryImage(sub);
          const summary = SUBCATEGORY_COPY[sub.name] || `Explore curated ${sub.name.toLowerCase()} picks in ${category.name}.`;

          return (
            <button
              key={`${category.slug}-${sub.slug}-${idx}`}
              type="button"
              className="se-minimal-card"
              onClick={() => navigate(`/products?categoryId=${category.id}&subcategory=${sub.slug}`)}
            >
              <div className="se-minimal-card-image">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={sub.name}
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div className="se-minimal-card-placeholder">{sub.name.charAt(0).toUpperCase()}</div>
                )}
              </div>

              <div className="se-minimal-card-content">
                <h3>{sub.name}</h3>
                <p>{summary}</p>
                <span className="se-minimal-card-cta">
                  Shop Now
                  <FaArrowRight />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SubcategoryGrid;
