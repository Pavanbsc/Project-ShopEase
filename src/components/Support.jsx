import { useState } from 'react';
import {
  FaTimes,
  FaComments,
  FaBox,
  FaUndoAlt,
  FaCreditCard,
  FaUser,
  FaQuestionCircle,
  FaPhone,
  FaPaperPlane,
  FaTicketAlt,
  FaShieldAlt,
  FaHeadset,
} from 'react-icons/fa';

function Support({ onClose }) {
  const [activeTab, setActiveTab] = useState('live-chat');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! Welcome to ShopEase Support. How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const supportCategories = [
    {
      id: 'live-chat',
      label: 'Live Chat',
      icon: FaComments,
      description: 'Chat with AI Support',
      color: '#3b82f6',
    },
    {
      id: 'orders',
      label: 'Order Issues',
      icon: FaBox,
      description: 'Track & manage orders',
      color: '#8b5cf6',
    },
    {
      id: 'returns',
      label: 'Returns & Refunds',
      icon: FaUndoAlt,
      description: 'Initiate returns',
      color: '#ec4899',
    },
    {
      id: 'payment',
      label: 'Payment Help',
      icon: FaCreditCard,
      description: 'Payment issues',
      color: '#f59e0b',
    },
    {
      id: 'account',
      label: 'Account Support',
      icon: FaUser,
      description: 'Account & login',
      color: '#10b981',
    },
    {
      id: 'faq',
      label: 'FAQs',
      icon: FaQuestionCircle,
      description: 'Browse help articles',
      color: '#06b6d4',
    },
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'Go to your profile, click "Orders", and select the order to see tracking details.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns for most items in original condition. Visit Returns & Refunds for more.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and follow the email instructions.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, UPI, net banking, and digital wallets.',
    },
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        type: 'user',
        text: chatMessage,
        timestamp: new Date(),
      };
      setChatMessages([...chatMessages, newMessage]);

      // Simulate bot response
      setTimeout(() => {
        const botResponses = [
          'Thank you for your message! Our team is looking into this.',
          'I understand. Let me help you with that.',
          'That\'s a great question! Here\'s what I found...',
          'I\'m here to help! Can you provide more details?',
        ];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: 'bot',
            text: randomResponse,
            timestamp: new Date(),
          },
        ]);
      }, 800);

      setChatMessage('');
    }
  };

  // Component is mounted conditionally by parent, so always render

  return (
    <>
      {/* Backdrop */}
      <div className="se-support-backdrop" onClick={onClose} />

      {/* Support Modal */}
      <div className="se-support-modal">
        {/* Header */}
        <div className="se-support-header">
          <div className="se-support-title-section">
            <div className="se-support-badge">
              <FaHeadset className="se-support-badge-icon" />
              <span className="se-support-live-indicator" />
            </div>
            <div>
              <h1>ShopEase 24x7 Support</h1>
              <p>We're here to help, anytime, anywhere</p>
            </div>
          </div>
          <button className="se-support-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Main Content */}
        <div className="se-support-container">
          {/* Sidebar Categories */}
          <div className="se-support-sidebar">
            <div className="se-support-categories">
              {supportCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`se-support-category-btn ${activeTab === category.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(category.id)}
                    style={{
                      borderLeftColor: activeTab === category.id ? category.color : 'transparent',
                    }}
                  >
                    <div className="se-support-category-icon" style={{ backgroundColor: `${category.color}15` }}>
                      <Icon style={{ color: category.color }} />
                    </div>
                    <div className="se-support-category-text">
                      <div className="se-support-category-label">{category.label}</div>
                      <div className="se-support-category-desc">{category.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="se-support-content">
            {activeTab === 'live-chat' && (
              <div className="se-support-panel">
                <div className="se-chat-header">
                  <h2>Live Chat Support</h2>
                  <p>Chat with our AI assistant powered by advanced support system</p>
                </div>

                <div className="se-panel-body se-chat-messages">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`se-chat-message se-chat-${msg.type}`}>
                      <div className="se-chat-bubble">{msg.text}</div>
                      <span className="se-chat-time">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="se-panel-footer se-chat-input-area">
                  <div className="se-chat-input-wrapper">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="se-chat-input"
                    />
                    <button className="se-chat-send-btn" onClick={handleSendMessage}>
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="se-support-panel">
                <div className="se-panel-body">
                  <h2>Order Issues</h2>
                  <div className="se-support-quick-actions">
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#8b5cf615' }}>
                        <FaBox style={{ color: '#8b5cf6' }} />
                      </div>
                      <h3>Track Order</h3>
                      <p>Check real-time delivery updates</p>
                      <button className="se-qa-btn">Track Now</button>
                    </div>
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#3b82f615' }}>
                        <FaTicketAlt style={{ color: '#3b82f6' }} />
                      </div>
                      <h3>Raise Ticket</h3>
                      <p>Report order-related issues</p>
                      <button className="se-qa-btn">Create Ticket</button>
                    </div>
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#f5950015' }}>
                        <FaPhone style={{ color: '#f59e0b' }} />
                      </div>
                      <h3>Call Support</h3>
                      <p>Speak with support team</p>
                      <button className="se-qa-btn">Call Now</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="se-support-panel">
                <div className="se-panel-body">
                  <h2>Returns & Refunds</h2>
                  <div className="se-support-quick-actions">
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#ec489915' }}>
                        <FaUndoAlt style={{ color: '#ec4899' }} />
                      </div>
                      <h3>Initiate Return</h3>
                      <p>Start a return process</p>
                      <button className="se-qa-btn">Start Return</button>
                    </div>
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#10b98115' }}>
                        <FaCreditCard style={{ color: '#10b981' }} />
                      </div>
                      <h3>Refund Status</h3>
                      <p>Check refund progress</p>
                      <button className="se-qa-btn">View Status</button>
                    </div>
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#06b6d415' }}>
                        <FaQuestionCircle style={{ color: '#06b6d4' }} />
                      </div>
                      <h3>Return Policy</h3>
                      <p>Learn about our policy</p>
                      <button className="se-qa-btn">Learn More</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="se-support-panel">
                <div className="se-panel-body">
                  <h2>Payment Help</h2>
                  <div className="se-support-quick-actions">
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#f5950015' }}>
                        <FaCreditCard style={{ color: '#f59e0b' }} />
                      </div>
                      <h3>Payment Failed</h3>
                      <p>Troubleshoot payment issues</p>
                      <button className="se-qa-btn">Get Help</button>
                    </div>
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#8b5cf615' }}>
                        <FaTicketAlt style={{ color: '#8b5cf6' }} />
                      </div>
                      <h3>Refund Inquiry</h3>
                      <p>Track your refund</p>
                      <button className="se-qa-btn">Check Refund</button>
                    </div>
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#3b82f615' }}>
                        <FaComments style={{ color: '#3b82f6' }} />
                      </div>
                      <h3>Chat with Agent</h3>
                      <p>Speak with payment specialist</p>
                      <button className="se-qa-btn">Chat Now</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="se-support-panel">
                <div className="se-panel-body">
                  <h2>Account Support</h2>
                  <div className="se-support-quick-actions">
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#10b98115' }}>
                        <FaUser style={{ color: '#10b981' }} />
                      </div>
                      <h3>Login Issues</h3>
                      <p>Reset password or verify identity</p>
                      <button className="se-qa-btn">Get Help</button>
                    </div>
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#06b6d415' }}>
                        <FaShieldAlt style={{ color: '#06b6d4' }} />
                      </div>
                      <h3>Security</h3>
                      <p>Secure your account</p>
                      <button className="se-qa-btn">Learn More</button>
                    </div>
                    <div className="se-quick-action-card">
                      <div className="se-qa-icon" style={{ backgroundColor: '#ec489915' }}>
                        <FaTicketAlt style={{ color: '#ec4899' }} />
                      </div>
                      <h3>Edit Profile</h3>
                      <p>Update account details</p>
                      <button className="se-qa-btn">Edit Now</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="se-support-panel">
                <div className="se-panel-body">
                  <h2>Frequently Asked Questions</h2>
                  <div className="se-faq-list">
                    {faqs.map((faq, index) => (
                      <div key={index} className="se-faq-item-support">
                        <div className="se-faq-question-support">{faq.question}</div>
                        <div className="se-faq-answer-support">{faq.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Support;
