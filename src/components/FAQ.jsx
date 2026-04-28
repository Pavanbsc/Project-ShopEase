import React, { useState, useMemo } from 'react';
import { FaBox, FaCreditCard, FaUndoAlt, FaUser, FaHeadset, FaChevronDown, FaSearch } from 'react-icons/fa';

const FAQ = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Orders');

  // Backend-ready FAQ data structure
  const faqData = [
    // Orders
    {
      id: 1,
      category: 'Orders',
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time by visiting the "Orders" section in your profile. Enter your order ID or check the order details page for live tracking updates, estimated delivery date, and current location of your package.',
      icon: FaBox,
    },
    {
      id: 2,
      category: 'Orders',
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify your order within 30 minutes of placing it. After that, the order enters processing phase and cannot be modified. However, you can still cancel it with a refund to your original payment method within 24 hours if not dispatched.',
      icon: FaBox,
    },
    {
      id: 3,
      category: 'Orders',
      question: 'How long does delivery take?',
      answer: 'Delivery times vary based on your location and the seller. Standard delivery typically takes 5-7 business days, Express delivery 2-3 days, and Same-Day delivery if ordered before 12 PM. You can see the estimated delivery date at checkout.',
      icon: FaBox,
    },
    {
      id: 4,
      category: 'Orders',
      question: 'Do you offer international shipping?',
      answer: 'Currently, we deliver within the country only. International shipping is coming soon. You can subscribe to our newsletter to get notified when international delivery becomes available.',
      icon: FaBox,
    },

    // Payments
    {
      id: 5,
      category: 'Payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, net banking, digital wallets (Apple Pay, Google Pay), UPI, and cash on delivery. All transactions are secured with 256-bit encryption and PCI DSS compliance.',
      icon: FaCreditCard,
    },
    {
      id: 6,
      category: 'Payments',
      question: 'Is it safe to pay online on your platform?',
      answer: 'Yes, absolutely. We use industry-leading SSL encryption and PCI DSS certified payment gateways. Your payment information is never stored on our servers and is processed securely by trusted third-party payment providers.',
      icon: FaCreditCard,
    },
    {
      id: 7,
      category: 'Payments',
      question: 'Why was my payment declined?',
      answer: 'Common reasons include insufficient funds, incorrect card details, expired card, or daily transaction limits. Please check your card details, ensure sufficient balance, and try again. Contact your bank if the issue persists.',
      icon: FaCreditCard,
    },
    {
      id: 8,
      category: 'Payments',
      question: 'Do you offer installment options?',
      answer: 'Yes! For purchases above ₹10,000, you can opt for no-cost EMI on selected credit cards. Some debit cards also offer installment options. Check the payment page for available installment plans.',
      icon: FaCreditCard,
    },

    // Returns
    {
      id: 9,
      category: 'Returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day easy return policy. If you\'re not satisfied with your purchase, you can initiate a return within 30 days of delivery. The item should be in original condition with all packaging and accessories intact.',
      icon: FaUndoAlt,
    },
    {
      id: 10,
      category: 'Returns',
      question: 'How do I initiate a return?',
      answer: 'Go to "My Orders", select the order, click on "Return Item", choose your reason, and follow the return process. A return label will be generated. You can drop the package at any collection point, or we\'ll arrange pickup for free.',
      icon: FaUndoAlt,
    },
    {
      id: 11,
      category: 'Returns',
      question: 'How long does refund take?',
      answer: 'Refunds are processed within 5-7 business days after we receive and verify the returned item. For original payment method refunds, it may take an additional 2-3 business days depending on your bank.',
      icon: FaUndoAlt,
    },
    {
      id: 12,
      category: 'Returns',
      question: 'Can I return items purchased with COD?',
      answer: 'Yes, you can return COD purchases. Once the return is initiated and processed, the refund will be credited to your ShopEase wallet or your registered bank account within 5-7 business days.',
      icon: FaUndoAlt,
    },

    // Account
    {
      id: 13,
      category: 'Account',
      question: 'How do I create an account?',
      answer: 'Click the "Sign Up" button, enter your email address and create a password, or sign up using your social media account. Verify your email by clicking the confirmation link, and you\'re ready to start shopping!',
      icon: FaUser,
    },
    {
      id: 14,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your registered email, and check your email for a reset link. Click the link and create a new password. You\'ll receive a confirmation email once the password is updated.',
      icon: FaUser,
    },
    {
      id: 15,
      category: 'Account',
      question: 'Can I have multiple addresses on my account?',
      answer: 'Yes! You can save up to 10 addresses in your account. During checkout, you can select from your saved addresses or add a new one. Mark any address as default for faster future checkouts.',
      icon: FaUser,
    },
    {
      id: 16,
      category: 'Account',
      question: 'How do I delete my account?',
      answer: 'You can delete your account from Account Settings > Account Deletion. Note that this will remove all your data including order history and saved addresses. Once deleted, it cannot be recovered.',
      icon: FaUser,
    },

    // Support
    {
      id: 17,
      category: 'Support',
      question: 'How do I contact customer support?',
      answer: 'You can reach our support team via email, phone, live chat, or through the help section in your account. We\'re available 24/7 to assist you. Average response time is less than 2 hours.',
      icon: FaHeadset,
    },
    {
      id: 18,
      category: 'Support',
      question: 'Is there a phone number to call for urgent issues?',
      answer: 'Yes! For urgent matters, call our toll-free number 1800-SHOPEASE (1800-7467-3273) from any phone. Our support team is available 24/7 and will assist you promptly.',
      icon: FaHeadset,
    },
    {
      id: 19,
      category: 'Support',
      question: 'How can I report a problem with my order?',
      answer: 'Navigate to "My Orders", select the problematic order, and click "Report an Issue". Describe the problem with relevant details and upload photos if needed. Our team will investigate and resolve within 48 hours.',
      icon: FaHeadset,
    },
    {
      id: 20,
      category: 'Support',
      question: 'Do you offer seller support?',
      answer: 'Yes! If you\'re interested in selling on ShopEase, visit our Seller Center for complete documentation, training resources, and 24/7 seller support team to help you succeed.',
      icon: FaHeadset,
    },
  ];

  // Categories for filtering
  const categories = ['Orders', 'Payments', 'Returns', 'Account', 'Support'];

  // Category icons mapping
  const categoryIcons = {
    Orders: FaBox,
    Payments: FaCreditCard,
    Returns: FaUndoAlt,
    Account: FaUser,
    Support: FaHeadset,
  };

  // Filter and search FAQ data
  const filteredFAQ = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="se-faq-section">
      <div className="se-faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>Find quick answers to common questions about orders, payments, returns, and more</p>
      </div>

      <div className="se-faq-controls">
        {/* Search Bar */}
        <div className="se-faq-search">
          <FaSearch className="se-faq-search-icon" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="se-faq-search-input"
          />
          {searchTerm && (
            <button
              className="se-faq-clear-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="se-faq-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`se-faq-category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {categoryIcons[category] ? (
                <>
                  {React.createElement(categoryIcons[category], { className: 'se-faq-category-icon' })}
                  <span>{category}</span>
                </>
              ) : (
                <span>{category}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="se-faq-container">
        {filteredFAQ.length > 0 ? (
          filteredFAQ.map((item) => {
            const IconComponent = categoryIcons[item.category];
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`se-faq-item ${isExpanded ? 'expanded' : ''}`}
              >
                <button
                  className="se-faq-question"
                  onClick={() => toggleExpand(item.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <div className="se-faq-question-left">
                    {IconComponent && (
                      <div className="se-faq-icon-badge">
                        {React.createElement(IconComponent, { className: 'se-faq-item-icon' })}
                      </div>
                    )}
                    <div className="se-faq-question-text">
                      <span className="se-faq-category-label">{item.category}</span>
                      <p className="se-faq-question-title">{item.question}</p>
                    </div>
                  </div>
                  <FaChevronDown className={`se-faq-toggle-icon ${isExpanded ? 'open' : ''}`} />
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  className="se-faq-answer"
                  style={{ maxHeight: isExpanded ? '500px' : '0' }}
                >
                  <div className="se-faq-answer-content">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="se-faq-empty">
            <p>No FAQs found matching your search. Try different keywords or contact our support team.</p>
          </div>
        )}
      </div>

      {/* Still need help? */}
      <div className="se-faq-support-cta">
        <div className="se-faq-cta-content">
          <h3>Didn't find what you're looking for?</h3>
          <p>Our support team is here to help 24/7</p>
          <button className="se-faq-contact-btn">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
