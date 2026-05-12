import { formatCurrencyINR } from '../services/api';

function ProductGrid({ products, onAddToCart, addingProductId }) {
  if (!products.length) {
    return <div className="empty-state">No products available for this selection.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-card-top">
            <p className="product-category">
              {product.category_name || product.category?.name || 'Uncategorized'}
            </p>
          </div>

          {product.image_url || product.imageUrl ? (
            <img
              src={product.image_url || product.imageUrl}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
          ) : null}

          <h3>{product.name}</h3>
          <p>{product.description || 'No description available.'}</p>
          <div className="price-row">
            <strong>{formatCurrencyINR(product.price)}</strong>
          </div>

          {typeof onAddToCart === 'function' ? (
            <button
              type="button"
              className="add-to-cart-btn"
              disabled={Number(product.stock ?? 0) <= 0 || addingProductId === product.id}
              onClick={() => onAddToCart(product)}
            >
              {addingProductId === product.id
                ? 'Adding...'
                : Number(product.stock ?? 0) <= 0
                  ? 'Out of stock'
                  : 'Add to Cart'}
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export default ProductGrid;
