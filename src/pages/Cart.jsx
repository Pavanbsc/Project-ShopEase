import TopNavbar from '../components/TopNavbar';

function Cart() {
  return (
    <div className="se-dashboard-page">
      <TopNavbar />
      <main className="se-main-content">
        <section className="se-home-section">
          <div className="se-section-head se-title-row">
            <div>
              <h1>Your Cart</h1>
              <p>Items you add to cart will appear here.</p>
            </div>
          </div>
          <div className="empty-state">Your cart is empty. Start shopping from categories above.</div>
        </section>
      </main>
    </div>
  );
}

export default Cart;
