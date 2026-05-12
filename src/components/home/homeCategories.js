import {
  FaBolt,
  FaBook,
  FaCar,
  FaClock,
  FaDumbbell,
  FaGamepad,
  FaGem,
  FaHome,
  FaLaptop,
  FaMobileAlt,
  FaPaw,
  FaShoppingBasket,
  FaStar,
  FaTshirt,
} from 'react-icons/fa';

export const homeCategories = [
  {
    id: 'mobiles',
    name: 'Mobiles',
    description: 'Latest phones, accessories, and mobile essentials.',
    icon: FaMobileAlt,
    accent: '#2563eb',
    subcategories: [],
  },
  {
    id: 'laptops',
    name: 'Laptops',
    description: 'Performance devices for study, work, and creation.',
    icon: FaLaptop,
    accent: '#0f766e',
    subcategories: [],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Smart devices, gaming gear, and audio essentials.',
    icon: FaBolt,
    accent: '#7c3aed',
    subcategories: ['Audio', 'Cameras', 'Gaming', 'Smart Devices', 'Accessories'],
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Everyday style for men, women, and kids.',
    icon: FaTshirt,
    accent: '#db2777',
    subcategories: ['Men', 'Women', 'Kids', 'Footwear', 'Accessories'],
  },
  {
    id: 'watches',
    name: 'Watches',
    description: 'Classic, smart, and sporty timepieces.',
    icon: FaClock,
    accent: '#b45309',
    subcategories: ['Men’s Watches', 'Women’s Watches', 'Smart Watches', 'Sports Watches', 'Kids Watches'],
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    description: 'Furniture, storage, lighting, and kitchen essentials.',
    icon: FaHome,
    accent: '#ea580c',
    subcategories: ['Kitchen', 'Furniture', 'Home Decor', 'Storage', 'Lighting'],
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Skincare, haircare, cosmetics, and fragrances.',
    icon: FaStar,
    accent: '#ef4444',
    subcategories: ['Skincare', 'Haircare', 'Makeup', 'Fragrances'],
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Fitness, outdoor, and indoor recreation gear.',
    icon: FaDumbbell,
    accent: '#16a34a',
    subcategories: ['Fitness Equipment', 'Sportswear', 'Outdoor Sports', 'Indoor Games'],
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Reading, learning, and premium educational picks.',
    icon: FaBook,
    accent: '#0891b2',
    subcategories: [],
  },
  {
    id: 'groceries',
    name: 'Groceries',
    description: 'Daily essentials, pantry staples, and fresh picks.',
    icon: FaShoppingBasket,
    accent: '#059669',
    subcategories: [],
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    description: 'Elegant accessories for every occasion.',
    icon: FaGem,
    accent: '#8b5cf6',
    subcategories: [],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car care, bike accessories, and safety gear.',
    icon: FaCar,
    accent: '#475569',
    subcategories: ['Car Accessories', 'Bike Accessories', 'Maintenance', 'Safety'],
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies',
    description: 'Food, toys, and care products for pets.',
    icon: FaPaw,
    accent: '#f59e0b',
    subcategories: [],
  },
  {
    id: 'toys-games',
    name: 'Toys & Games',
    description: 'Fun, learning, and family-friendly play items.',
    icon: FaGamepad,
    accent: '#0ea5e9',
    subcategories: [],
  },
];

export const buildCategoryProductUrl = (categoryName, subcategoryName = '') => {
  const params = new URLSearchParams();
  if (categoryName) {
    params.set('category', categoryName);
  }
  if (subcategoryName) {
    params.set('subcategory', subcategoryName);
  }
  const query = params.toString();
  return query ? `/products?${query}` : '/products';
};
