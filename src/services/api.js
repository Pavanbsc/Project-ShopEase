import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8082/api/auth';

const authClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const STORAGE_KEYS = {
  user: 'shopease_user',
  token: 'shopease_token',
  loginTime: 'shopease_login_time',
  registeredUsers: 'shopease_registered_users',
};

export const DEMO_AUTH_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@shopease.com',
    password: 'Admin@123',
    role: 'ADMIN',
  },
  {
    id: 2,
    name: 'Demo User',
    email: 'user@shopease.com',
    password: 'User@123',
    role: 'USER',
  },
];

// Helper to create URL-friendly slugs
const slugify = (text) =>
  String(text || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const DEMO_CATEGORIES = [
  {
    id: 1,
    name: 'Mobiles',
    slug: slugify('Mobiles'),
    description: 'Latest smartphones and accessories.',
    image: '/src/assets/Category/Mobiles.png',
  },
  {
    id: 2,
    name: 'Laptops',
    slug: slugify('Laptops'),
    description: 'Top laptop brands and models.',
    image: '/src/assets/Category/Laptops.png',
  },
  {
    id: 3,
    name: 'Electronics',
    slug: slugify('Electronics'),
    description: 'Smart devices, accessories, and gadgets.',
    image: '/src/assets/Category/Electronics.png',
    subcategories: [
      { name: 'Audio', slug: slugify('Audio'), image: '/src/assets/Category/subcat/audio.jpg' },
      { name: 'Cameras', slug: slugify('Cameras'), image: '/src/assets/Category/subcat/cameras.jpg' },
      { name: 'Gaming', slug: slugify('Gaming'), image: '/src/assets/Category/subcat/gaming.jpg' },
      { name: 'Smart Devices', slug: slugify('Smart Devices'), image: '/src/assets/Category/subcat/smartDevices.jpg' },
      { name: 'Accessories', slug: slugify('Accessories'), image: '/src/assets/Category/subcat/Accessories.jpg' },
    ],
  },
  {
    id: 4,
    name: 'Fashion',
    slug: slugify('Fashion'),
    description: 'Trending styles for every season.',
    image: '/src/assets/Category/Fashion.png',
    subcategories: [
      { name: 'Men', slug: slugify('Men'), image: '/src/assets/Category/subcat/men.jpg' },
      { name: 'Women', slug: slugify('Women'), image: '/src/assets/Category/subcat/women.jpg' },
      { name: 'Kids', slug: slugify('Kids'), image: '/src/assets/Category/subcat/kids.jpg' },
      { name: 'Footwear', slug: slugify('Footwear'), image: '/src/assets/Category/subcat/footwear.jpg' },
      { name: 'Accessories', slug: slugify('Accessories'), image: '/src/assets/Category/subcat/access.jpg' },
    ],
  },
  {
    id: 5,
    name: 'Watches',
    slug: slugify('Watches'),
    description: 'Classic and smart watches for every style.',
    image: '/src/assets/Category/watch.png',
    subcategories: [
      { name: "Men's Watches", slug: slugify("Men's Watches"), image: '/src/assets/Category/subcat/menWatch.jpg' },
      { name: "Women's Watches", slug: slugify("Women's Watches"), image: '/src/assets/Category/subcat/womenWatch.jpg' },
      { name: 'Smart Watches', slug: slugify('Smart Watches'), image: '/src/assets/Category/subcat/smartWatch.jpg' },
      { name: 'Sports Watches', slug: slugify('Sports Watches'), image: '/src/assets/Category/subcat/sportsWatch.jpg' },
      { name: 'Kids Watches', slug: slugify('Kids Watches'), image: '/src/assets/Category/subcat/kidsWatch.jpg' },
    ],
  },
  {
    id: 6,
    name: 'Home & Kitchen',
    slug: slugify('Home & Kitchen'),
    description: 'Essentials for a comfortable home.',
    image: '/src/assets/Category/Kitchen.png',
    subcategories: [
        { name: 'Kitchen', slug: slugify('Kitchen'), image: '/src/assets/Category/subcat/kitchen.jpg' },
        { name: 'Furniture', slug: slugify('Furniture'), image: '/src/assets/Category/subcat/furniture.jpg' },
        { name: 'Home Decor', slug: slugify('Home Decor'), image: '/src/assets/Category/subcat/homedecor.jpg' },
        { name: 'Storage', slug: slugify('Storage'), image: '/src/assets/Category/subcat/storage.jpg' },
        { name: 'Lighting', slug: slugify('Lighting'), image: '/src/assets/Category/subcat/lighting.jpg' },
    ],
  },
  {
    id: 7,
    name: 'Beauty',
    slug: slugify('Beauty'),
    description: 'Skincare, grooming, and self-care products.',
    image: '/src/assets/Category/Beauty.png',
    subcategories: [
        { name: 'Skincare', slug: slugify('Skincare'), image: '/src/assets/Category/subcat/skincare.jpg' },
        { name: 'Haircare', slug: slugify('Haircare'), image: '/src/assets/Category/subcat/haircare.jpg' },
        { name: 'Makeup', slug: slugify('Makeup'), image: '/src/assets/Category/subcat/makeup.jpg' },
        { name: 'Fragrances', slug: slugify('Fragrances'), image: '/src/assets/Category/subcat/fragrance.jpg' },
    ],
  },
  {
    id: 8,
    name: 'Sports',
    slug: slugify('Sports'),
    description: 'Gear up with fitness and outdoor items.',
    image: '/src/assets/Category/Sports.png',
    subcategories: [
      { name: 'Fitness Equipment', slug: slugify('Fitness Equipment'), image: '/src/assets/Category/subcat/fitness.jpg' },
      { name: 'Sportswear', slug: slugify('Sportswear'), image: '/src/assets/Category/subcat/sportswear.jpg' },
      { name: 'Outdoor Sports', slug: slugify('Outdoor Sports'), image: '/src/assets/Category/subcat/outdoor.jpg' },
      { name: 'Indoor Games', slug: slugify('Indoor Games'), image: '/src/assets/Category/subcat/indoor.jpg' },
    ],
  },
  { id: 9, name: 'Books', slug: slugify('Books'), description: 'Best-selling books and learning resources.', image: '/src/assets/Category/Books.png' },
  { id: 10, name: 'Groceries', slug: slugify('Groceries'), description: 'Fresh groceries and daily essentials.', image: '/src/assets/Category/Groceries.png' },
  { id: 11, name: 'Jewelry', slug: slugify('Jewelry'), description: 'Elegant jewelry and accessories.', image: '/src/assets/Category/Jewelry.png' },
  { id: 12, name: 'Automotive', slug: slugify('Automotive'), description: 'Car accessories and auto parts.', image: '/src/assets/Category/Automotive.png', subcategories: [
      { name: 'Car Accessories', slug: slugify('Car Accessories') },
      { name: 'Bike Accessories', slug: slugify('Bike Accessories') },
      { name: 'Maintenance', slug: slugify('Maintenance') },
      { name: 'Safety', slug: slugify('Safety') },
    ] },
  { id: 13, name: 'Pet Supplies', slug: slugify('Pet Supplies'), description: 'Everything for your pets.', image: '/src/assets/Category/PetSupplies.png' },
  { id: 14, name: 'Toys & Games', slug: slugify('Toys & Games'), description: 'Fun toys and games for all ages.', image: '/src/assets/Category/Toys&Games1.png' },
];

const CATEGORY_BY_NAME = Object.fromEntries(DEMO_CATEGORIES.map((category) => [category.name, category]));
const CATEGORY_BY_SLUG = Object.fromEntries(DEMO_CATEGORIES.map((category) => [category.slug, category]));

export const DEMO_PRODUCTS = [];

const getRoleBasedPath = (role) => (role === 'ADMIN' ? '/admin-dashboard' : '/home');

const createApiError = (message, status = 400) => {
  const error = new Error(message);
  error.response = { data: { message }, status };
  return error;
};

const readStoredUsers = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.registeredUsers);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredUsers = (users) => {
  window.localStorage.setItem(STORAGE_KEYS.registeredUsers, JSON.stringify(users));
};

const getAllAuthUsers = () => {
  const storedUsers = readStoredUsers();
  return [...DEMO_AUTH_USERS, ...storedUsers].reduce((accumulator, user) => {
    if (!accumulator.some((existing) => existing.email.toLowerCase() === user.email.toLowerCase())) {
      accumulator.push(user);
    }
    return accumulator;
  }, []);
};

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role || 'USER',
});

const persistSession = (user, token) => {
  const normalized = normalizeUser(user);
  const sessionToken = token || `session_${normalized.id}_${Date.now()}`;

  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalized));
  window.localStorage.setItem(STORAGE_KEYS.token, sessionToken);
  window.localStorage.setItem(STORAGE_KEYS.loginTime, new Date().toISOString());

  // Notify app about auth state change so UI can update
  try {
    window.dispatchEvent(new Event('authStateChanged'));
  } catch (e) {
    // ignore in non-browser environments
  }

  return {
    token: sessionToken,
    role: normalized.role,
    user: normalized,
    message: 'Login successful',
  };
};

export const loginUser = async (payload = {}) => {
  const email = String(payload.email || '').trim();
  const password = String(payload.password || '').trim();

  if (!email || !password) {
    throw createApiError('Email and password are required', 400);
  }

  try {
    const { data } = await authClient.post('/login', { email, password });
    const session = persistSession(data?.user || {}, data?.token);

    return {
      ...data,
      ...session,
    };
  } catch (error) {
    const localUser = getAllAuthUsers().find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (localUser) {
      const session = persistSession(localUser);
      return {
        ...session,
        message: 'Login successful',
      };
    }

    throw error;
  }
};

export const registerUser = async (payload = {}) => {
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const password = String(payload.password || '').trim();
  const role = payload.role === 'ADMIN' ? 'ADMIN' : 'USER';

  if (!name || !email || !password) {
    throw createApiError('Name, email, and password are required', 400);
  }

  if (password.length < 8) {
    throw createApiError('Password must be at least 8 characters long', 400);
  }

  const { data } = await authClient.post('/register', { name, email, password, role });

  if (data?.user && data?.token) {
    persistSession(data.user, data.token);
  }

  return data;
};

export const logoutUser = () => {
  window.localStorage.removeItem(STORAGE_KEYS.user);
  window.localStorage.removeItem(STORAGE_KEYS.token);
  window.localStorage.removeItem(STORAGE_KEYS.loginTime);
};

export const getLoggedInUser = () => {
  try {
    const userString = window.localStorage.getItem(STORAGE_KEYS.user);
    return userString ? JSON.parse(userString) : null;
  } catch {
    logoutUser();
    return null;
  }
};

export const isUserLoggedIn = () => {
  return Boolean(window.localStorage.getItem(STORAGE_KEYS.token) && getLoggedInUser());
};

export const getAuthToken = () => window.localStorage.getItem(STORAGE_KEYS.token);

export const getUserProfile = async (userId) => {
  if (!userId) {
    throw createApiError('User id is required', 400);
  }

  const { data } = await authClient.get(`/users/${userId}/profile`);
  return data;
};

export const updateUserProfile = async (userId, payload = {}) => {
  if (!userId) {
    throw createApiError('User id is required', 400);
  }

  const { data } = await authClient.put(`/users/${userId}/profile`, payload);
  return data;
};

export const getPostLoginPath = () => {
  const user = getLoggedInUser();
  return getRoleBasedPath(user?.role);
};

export const getPathByRole = (role) => getRoleBasedPath(role);

export const getCategories = async () => DEMO_CATEGORIES;


export const getMembershipPlans = async () => {
  const { data } = await authClient.get('/memberships/plans');
  return data;
};

export const createPaymentOrder = async (payload = {}) => {
  const { data } = await authClient.post('/payments/orders', payload);
  return data;
};

export const verifyPaymentOrder = async (payload = {}) => {
  const { data } = await authClient.post('/payments/verify', payload);
  return data;
};

export const reportPaymentFailure = async (payload = {}) => {
  const { data } = await authClient.post('/payments/failure', payload);
  return data;
};

export const createMembershipPaymentOrder = async ({ userId, plan, billingCycle, autoRenew = true, metadata = {} } = {}) => {
  return createPaymentOrder({
    userId,
    purpose: 'MEMBERSHIP',
    referenceType: 'MEMBERSHIP',
    referenceId: `${String(plan || '').toUpperCase()}_${String(billingCycle || '').toUpperCase()}`,
    plan,
    billingCycle,
    autoRenew,
    metadata,
  });
};

export const getMembershipStatus = async (userId) => {
  if (!userId) {
    throw createApiError('User id is required', 400);
  }
  const { data } = await authClient.get(`/users/${userId}/membership`);
  return data;
};

export const subscribeMembership = async (userId, payload = {}) => {
  return createMembershipPaymentOrder({ userId, ...payload });
};

export const hasMembershipFeature = async (userId, feature) => {
  if (!userId || !feature) {
    throw createApiError('User id and feature are required', 400);
  }
  const { data } = await authClient.get(`/users/${userId}/membership/access/${feature}`);
  return data;
};

export const getAdminUsers = async () => {
  try {
    const { data } = await authClient.get('/users');
    return data;
  } catch (err) {
    return getAllAuthUsers();
  }
};

// Product service helpers
const PRODUCT_BASE = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:8083/api/products';
const PRODUCT_BASE_CANDIDATES = [
  PRODUCT_BASE,
  'http://127.0.0.1:8083/api/products',
  '/api/products',
];

// Cart service base URL
const CART_BASE = import.meta.env.VITE_CART_API_URL || 'http://localhost:8085/api/cart';
const ORDER_BASE = import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8086/api/orders';

const SHOPPING_KEYS = {
  cartItems: 'shopease_cart_items',
  cartCount: 'shopease_cart_count',
  wishlistItems: 'shopease_wishlist_items',
};

const mapProductRecord = (product) => ({
  ...product,
  category: product.categoryId
    ? { id: product.categoryId, name: product.category, slug: product.categorySlug }
    : product.category,
  stock: product.stockQuantity,
  finalPrice: product.price,
  originalPrice: product.originalPrice,
  discountPercent: product.discountPercent,
  active: product.active !== false,
  updatedAt: product.updatedAt || product.createdAt || null,
  imageUrl: Array.isArray(product.images) && product.images.length ? product.images[0] : '',
  seller: {
    name: product.sellerName,
    type: product.sellerType,
    location: product.sellerLocation,
  },
});

export const createProduct = async (payload = {}) => {
  try {
    const { data } = await axios.post(PRODUCT_BASE, payload, { headers: { 'Content-Type': 'application/json' } });
    return data;
  } catch (err) {
    console.error('createProduct failed', err);
    throw err;
  }
};

export const getProducts = async (options = {}) => {
  const includeDisabled = Boolean(options.includeDisabled);
  let lastError = null;

  for (const url of PRODUCT_BASE_CANDIDATES) {
    try {
      const { data } = await axios.get(url, {
        params: includeDisabled ? { includeDisabled: true } : undefined,
      });
      const items = data && Array.isArray(data.Items) ? data.Items : data;

      if (Array.isArray(items)) {
        return items.map(mapProductRecord);
      }
    } catch (error) {
      lastError = error;
    }
  }

  const message =
    lastError?.response?.data?.message ||
    lastError?.message ||
    'Unable to load products from backend. Ensure product-service is running on port 8083.';
  throw createApiError(message, lastError?.response?.status || 500);
};

export const getInventoryProducts = async () => getProducts({ includeDisabled: true });

export const getProductById = async (productId) => {
  const { data } = await axios.get(`${PRODUCT_BASE}/${productId}`);
  return mapProductRecord(data);
};

const readLocalCollection = (key) => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalCollection = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const emitCartUpdated = (items) => {
  const count = items.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  window.localStorage.setItem(SHOPPING_KEYS.cartCount, String(count));
  window.dispatchEvent(new Event('cartUpdated'));
};

// Cart API functions - use backend database instead of localStorage
export const getCartItems = async () => {
  try {
    const user = getLoggedInUser();
    if (!user || !user.id) {
      console.warn('User not logged in, returning empty cart');
      return [];
    }

    const { data } = await axios.get(`${CART_BASE}/user/${user.id}`);
    const items = data?.items || [];
    emitCartUpdated(items);
    return items;
  } catch (err) {
    console.error('Error fetching cart from API:', err);
    return [];
  }
};

export const addProductToCart = async (product, quantity = 1) => {
  try {
    const user = getLoggedInUser();
    if (!user || !user.id) {
      throw createApiError('User not logged in', 401);
    }

    const qty = Math.max(1, Number(quantity || 1));
    const cartItem = {
      productId: Number(product.id),
      productName: product.name,
      brand: product.brand,
      quantity: qty,
      price: Number(product.price ?? product.finalPrice ?? 0),
      originalPrice: Number(product.originalPrice ?? product.price ?? 0),
      imageUrl: product.imageUrl || product.images?.[0] || '',
      sellerName: product.sellerName || product.seller?.name || '',
      category: typeof product.category === 'object' ? product.category?.name : product.category,
      stockQuantity: Number(product.stockQuantity ?? product.stock ?? 0),
    };

    const { data } = await axios.post(`${CART_BASE}/user/${user.id}`, cartItem);
    const items = data?.items || [];
    emitCartUpdated(items);
    return items;
  } catch (err) {
    console.error('Error adding product to cart:', err);
    throw err;
  }
};

export const removeProductFromCart = async (productId) => {
  try {
    const user = getLoggedInUser();
    if (!user || !user.id) {
      throw createApiError('User not logged in', 401);
    }

    const { data } = await axios.delete(`${CART_BASE}/user/${user.id}/product/${productId}`);
    const items = data?.items || [];
    emitCartUpdated(items);
    return items;
  } catch (err) {
    console.error('Error removing product from cart:', err);
    throw err;
  }
};

export const updateCartItemQuantity = async (productId, quantity) => {
  try {
    const user = getLoggedInUser();
    if (!user || !user.id) {
      throw createApiError('User not logged in', 401);
    }

    const qty = Math.max(1, Number(quantity || 1));
    const { data } = await axios.put(`${CART_BASE}/user/${user.id}/product/${productId}?quantity=${qty}`);
    const items = data?.items || [];
    emitCartUpdated(items);
    return items;
  } catch (err) {
    console.error('Error updating cart item quantity:', err);
    throw err;
  }
};

export const clearCart = async () => {
  try {
    const user = getLoggedInUser();
    if (!user || !user.id) {
      throw createApiError('User not logged in', 401);
    }

    const { data } = await axios.delete(`${CART_BASE}/user/${user.id}`);
    emitCartUpdated([]);
    return [];
  } catch (err) {
    console.error('Error clearing cart:', err);
    throw err;
  }
};

export const createOrder = async (payload = {}) => {
  const { data } = await axios.post(ORDER_BASE, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const getOrdersForUser = async (userId) => {
  if (!userId) {
    throw createApiError('User id is required', 400);
  }
  const { data } = await axios.get(`${ORDER_BASE}/user/${userId}`);
  return Array.isArray(data) ? data : [];
};

export const getOrderById = async (orderId) => {
  if (!orderId) {
    throw createApiError('Order id is required', 400);
  }
  const { data } = await axios.get(`${ORDER_BASE}/${orderId}`);
  return data;
};

export const getAllOrders = async () => {
  const { data } = await axios.get(ORDER_BASE);
  return Array.isArray(data) ? data : [];
};

export const updateOrderStatus = async (orderId, status) => {
  if (!orderId || !status) {
    throw createApiError('Order id and status are required', 400);
  }
  const { data } = await axios.put(`${ORDER_BASE}/${orderId}/status`, { status }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const getWishlistItems = () => readLocalCollection(SHOPPING_KEYS.wishlistItems);

export const isWishlisted = (productId) => {
  return getWishlistItems().some((item) => Number(item.id) === Number(productId));
};

export const toggleWishlistProduct = (product) => {
  const items = getWishlistItems();
  const existing = items.some((item) => Number(item.id) === Number(product.id));
  const next = existing
    ? items.filter((item) => Number(item.id) !== Number(product.id))
    : [
        ...items,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: Number(product.price ?? product.finalPrice ?? 0),
          image: product.imageUrl || product.images?.[0] || '',
        },
      ];

  writeLocalCollection(SHOPPING_KEYS.wishlistItems, next);
  window.dispatchEvent(new Event('wishlistUpdated'));
  return { items: next, isWishlisted: !existing };
};

export const updateProduct = async (productId, payload = {}) => {
  const { data } = await axios.put(`${PRODUCT_BASE}/${productId}`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return mapProductRecord(data);
};

export const updateProductStock = async (productId, stockQuantity) => {
  const { data } = await axios.patch(`${PRODUCT_BASE}/${productId}/stock`, { stockQuantity }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return mapProductRecord(data);
};

export const setProductActive = async (productId, active) => {
  const { data } = await axios.patch(`${PRODUCT_BASE}/${productId}/status`, { active }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return mapProductRecord(data);
};

export const deleteProductById = async (productId) => {
  await axios.delete(`${PRODUCT_BASE}/${productId}`);
  return true;
};

export const getProductsByCategory = async (categoryId) => {
  const products = await getProducts();
  const id = Number(categoryId);
  return products.filter((product) => Number(product.category?.id) === id || Number(product.categoryId) === id);
};

const api = {
  get: async (url) => {
    if (url === '/api/categories') {
      return { data: DEMO_CATEGORIES };
    }

    if (url === '/api/products') {
      const data = await getProducts();
      return { data };
    }

    const categoryProductsMatch = String(url).match(/^\/api\/categories\/(\d+)\/products$/);
    if (categoryProductsMatch) {
      const categoryId = Number(categoryProductsMatch[1]);
      const data = await getProductsByCategory(categoryId);
      return { data };
    }

    throw createApiError(`Unknown endpoint: ${url}`, 404);
  },
  post: async (url, payload) => {
    if (url === '/api/auth/login') {
      const data = await loginUser(payload);
      return { data };
    }

    if (url === '/api/auth/register') {
      const data = await registerUser(payload);
      return { data };
    }

    if (String(url).includes('/api/products')) {
      const data = await createProduct(payload);
      return { data };
    }

    throw createApiError(`Unknown endpoint: ${url}`, 404);
  },
};

export default api;
