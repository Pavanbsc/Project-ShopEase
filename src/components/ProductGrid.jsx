function ProductGrid({ products }) {
  if (!products.length) {
    return <div className="empty-state">No products available for this selection.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-card-top">
            <p className="product-category">{product.category?.name || 'Uncategorized'}</p>
            <span className={`stock-pill ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <h3>{product.name}</h3>
          <p>{product.description || 'No description available.'}</p>
          <div className="price-row">
            <strong>${Number(product.price ?? 0).toFixed(2)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ProductGrid;
