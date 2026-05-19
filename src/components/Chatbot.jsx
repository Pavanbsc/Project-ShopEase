import { useEffect, useState, useRef } from 'react';
import { FaRobot, FaTimes, FaBox, FaArrowRight, FaCreditCard, FaHeadset } from 'react-icons/fa';
import helpImage from '../assets/help.png';
import '../styles/chatbot.css';

const POS_KEY = 'se_chatbot_pos';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const draggingRef = useRef(false);
  const pointerIdRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0, origX: 0, origY: 0 });

  const [pos, setPos] = useState(() => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

  // Calculate optimal panel position based on viewport
  useEffect(() => {
    if (!open) return;

    const calculatePanelPosition = () => {
      const padding = 24;
      const fabSize = 64;
      const isMobile = window.innerWidth <= 480;

      // Dynamic panel dimensions based on viewport
      let panelWidth = isMobile ? Math.min(380, window.innerWidth - padding) : 380;
      let panelHeight = isMobile ? Math.min(600, window.innerHeight - 80) : 600;

      // FAB position
      const fabX = pos?.x ?? (window.innerWidth - padding - fabSize);
      const fabY = pos?.y ?? (window.innerHeight - padding - fabSize);

      let panelLeft = fabX - panelWidth + fabSize;
      let panelTop = fabY - panelHeight;

      // On mobile devices, center the panel horizontally
      if (isMobile) {
        panelLeft = (window.innerWidth - panelWidth) / 2;
        panelTop = Math.max(padding, (window.innerHeight - panelHeight) / 2);
      } else {
        // Adjust if panel goes off-screen
        // Left boundary check
        if (panelLeft < padding) {
          panelLeft = padding;
        }

        // Right boundary check
        if (panelLeft + panelWidth > window.innerWidth - padding) {
          panelLeft = window.innerWidth - panelWidth - padding;
        }

        // Top boundary check
        if (panelTop < padding) {
          panelTop = padding;
        }

        // Bottom boundary check
        if (panelTop + panelHeight > window.innerHeight - padding) {
          panelTop = window.innerHeight - panelHeight - padding;
        }
      }

      setPanelPos({ top: panelTop, left: panelLeft });
    };

    calculatePanelPosition();
    window.addEventListener('resize', calculatePanelPosition);
    return () => window.removeEventListener('resize', calculatePanelPosition);
  }, [open, pos]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Show pulse hint once per session
  useEffect(() => {
    if (!sessionStorage.getItem('se_chatbot_animated')) {
      sessionStorage.setItem('se_chatbot_animated', '1');
    }
  }, []);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const savePos = (p) => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(p));
    } catch {}
  };

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'bot', text, timestamp: new Date() }]);
      setIsTyping(false);
    }, 600);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { type: 'user', text, timestamp: new Date() }]);
    setShowWelcome(false);

    // Simulate bot response based on user message
    const lowerText = text.toLowerCase();
    let response = '';

    if (lowerText.includes('track') || lowerText.includes('order')) {
      response = "I can help you track your order! Please provide your order ID and I'll get the latest status for you.";
    } else if (lowerText.includes('product') || lowerText.includes('help')) {
      response = "What specific product information do you need? I'm here to help with product descriptions, availability, or recommendations!";
    } else if (lowerText.includes('return') || lowerText.includes('exchange')) {
      response = "Our returns and exchanges are hassle-free! Tell me about the item you'd like to return, and I'll guide you through the process.";
    } else if (lowerText.includes('payment') || lowerText.includes('refund')) {
      response = "I can assist with payment and refund queries. What specific payment issue are you facing?";
    } else if (lowerText.includes('support') || lowerText.includes('issue')) {
      response = "I'm here to help! Could you describe the issue you're facing so I can assist you better?";
    } else {
      response = "Got it! How else can I assist you today? Feel free to ask about tracking orders, product help, returns, payments, or anything else!";
    }

    addBotMessage(response);
  };

  const handleQuickAction = (action) => {
    const messages = {
      track: "I'd like to track my order",
      product: "I need product help",
      returns: "I want to return or exchange an item",
      payments: "I have a payment question",
      support: "I need immediate support",
    };
    addUserMessage(messages[action]);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    addUserMessage(userInput);
    setUserInput('');
  };

  const handleOpen = (e) => {
    if (draggingRef.current) return;
    setOpen(true);
    setShowGreeting(false);
    sessionStorage.setItem('se_chatbot_animated', '1');
  };

  const handleClose = () => {
    setOpen(false);
    setShowGreeting(true);
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    draggingRef.current = false;
    pointerIdRef.current = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = pos?.x ?? (window.innerWidth - 24 - 64);
    const origY = pos?.y ?? (window.innerHeight - 24 - 64);
    startRef.current = { x: startX, y: startY, origX, origY };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const moved = Math.hypot(dx, dy) > 4;
    if (moved) draggingRef.current = true;
    const nextX = startRef.current.origX + dx;
    const nextY = startRef.current.origY + dy;
    const clampedX = clamp(nextX, 8, window.innerWidth - 64 - 8);
    const clampedY = clamp(nextY, 8, window.innerHeight - 64 - 8);
    setPos({ x: clampedX, y: clampedY });
  };

  const onPointerUp = (e) => {
    try {
      e.target.releasePointerCapture && e.target.releasePointerCapture(e.pointerId);
    } catch {}
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    if (draggingRef.current) {
      savePos(pos);
    }

    // small timeout to allow click handler to see draggingRef
    setTimeout(() => {
      draggingRef.current = false;
    }, 10);
  };

  const fabStyle = pos
    ? { left: `${pos.x}px`, top: `${pos.y}px`, right: 'auto', bottom: 'auto' }
    : undefined;

  return (
    <div className="se-chatbot-root" style={fabStyle}>
      {!open && showGreeting && (
        <div className="se-greeting-bubble">
          <div className="se-greeting-content">
            <p className="se-greeting-text">👋 Hi! I'm ShopEase Assistant</p>
            <p className="se-greeting-subtext">Need help with your order?</p>
          </div>
          <div className="se-greeting-arrow"></div>
        </div>
      )}

      {!open && (
        <button
          className="se-chatbot-fab se-fab-animate"
          aria-label="Open chat"
          onClick={handleOpen}
          onPointerDown={onPointerDown}
          title="ShopEase Assistant"
        >
          <img src={helpImage} alt="Help" className="se-fab-image" />
        </button>
      )}

      {open && (
        <div className="se-chatbot-panel se-panel-open" style={{ top: `${panelPos.top}px`, left: `${panelPos.left}px` }}>
          <div className="se-chatbot-header">
            <div className="se-header-content">
              <div className="se-header-icon">
                <FaRobot />
              </div>
              <div className="se-header-text">
                <h3>ShopEase Assistant</h3>
                <p>Always here to help</p>
              </div>
            </div>
            <button className="se-chatbot-close" onClick={handleClose} aria-label="Close">
              <FaTimes />
            </button>
          </div>

          <div className="se-chatbot-messages">
            {showWelcome && messages.length === 0 && (
              <div className="se-welcome-container">
                <div className="se-welcome-icon">
                  <FaRobot />
                </div>
                <h4>Welcome to ShopEase!</h4>
                <p>Your AI-powered shopping assistant is ready to help you find the perfect products and resolve any concerns.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`se-message se-message-${msg.type}`}>
                <div className="se-message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="se-message se-message-bot">
                <div className="se-message-bubble se-typing-bubble">
                  <div className="se-typing-dot"></div>
                  <div className="se-typing-dot"></div>
                  <div className="se-typing-dot"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showWelcome && messages.length === 0 && (
            <div className="se-quick-actions">
              <p className="se-quick-label">Quick Help</p>
              <button className="se-quick-btn" onClick={() => handleQuickAction('track')}>
                <FaBox />
                <span>Track Order</span>
              </button>
              <button className="se-quick-btn" onClick={() => handleQuickAction('product')}>
                <FaArrowRight />
                <span>Product Help</span>
              </button>
              <button className="se-quick-btn" onClick={() => handleQuickAction('returns')}>
                <FaArrowRight />
                <span>Returns & Exchange</span>
              </button>
              <button className="se-quick-btn" onClick={() => handleQuickAction('payments')}>
                <FaCreditCard />
                <span>Payments</span>
              </button>
              <button className="se-quick-btn" onClick={() => handleQuickAction('support')}>
                <FaHeadset />
                <span>Contact Support</span>
              </button>
            </div>
          )}

          <div className="se-chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="se-input-field"
              disabled={isTyping}
            />
            <button
              className="se-send-btn"
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isTyping}
              aria-label="Send message"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
