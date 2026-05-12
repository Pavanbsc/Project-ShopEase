import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8082/api/auth';
const PRODUCTS_BASE_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8083/api';
const CART_BASE_URL = import.meta.env.VITE_CART_API_URL || 'http://localhost:8087/api/cart';

const authClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

authClient.interceptors.request.use(config => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token && config?.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
    name: 'meghana',
    email: 'meghana@gmail.com',
    password: 'admin@2004',
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

export const DEMO_CATEGORIES = [
  { id: 1, name: 'Electronics', description: 'Smart devices, accessories, and gadgets.', image: '/src/assets/Category/Electronics.png' },
  { id: 2, name: 'Fashion', description: 'Trending styles for every season.', image: '/src/assets/Category/Fashion.png' },
  { id: 3, name: 'Home & Kitchen', description: 'Essentials for a comfortable home.', image: '/src/assets/Category/Kitchen.png' },
  { id: 4, name: 'Beauty', description: 'Skincare, grooming, and self-care products.', image: '/src/assets/Category/Beauty.png' },
  { id: 5, name: 'Sports', description: 'Gear up with fitness and outdoor items.', image: '/src/assets/Category/Sports.png' },
  { id: 6, name: 'Books', description: 'Best-selling books and learning resources.', image: '/src/assets/Category/Books.png' },
  { id: 7, name: 'Mobiles', description: 'Latest smartphones and accessories.', image: '/src/assets/Category/Mobiles.png' },
  { id: 8, name: 'Laptops', description: 'Top laptop brands and models.', image: '/src/assets/Category/Laptops.png' },
  { id: 9, name: 'Groceries', description: 'Fresh groceries and daily essentials.', image: '/src/assets/Category/Groceries.png' },
  { id: 10, name: 'Home Decors', description: 'Beautiful home decoration items.', image: '/src/assets/Category/HomeDecors.png' },
  { id: 11, name: 'Jewelry', description: 'Elegant jewelry and accessories.', image: '/src/assets/Category/Jewelry.png' },
  { id: 12, name: 'Automotive', description: 'Car accessories and auto parts.', image: '/src/assets/Category/Automotive.png' },
  { id: 13, name: 'Pet Supplies', description: 'Everything for your pets.', image: '/src/assets/Category/PetSupplies.png' },
  { id: 14, name: 'Toys & Games', description: 'Fun toys and games for all ages.', image: '/src/assets/Category/Toys&Games1.png' },
];

export const DEMO_PRODUCTS = [
  {
    id: 101,
    name: 'Noise-Cancelling Headphones',
    description: 'Immersive audio with active noise cancellation.',
    price: 129.99,
    stock: 18,
    category: DEMO_CATEGORIES[0],
  },
  {
    id: 102,
    name: 'Smart Watch Pro',
    description: 'Track fitness, sleep, and notifications in style.',
    price: 89.99,
    stock: 24,
    category: DEMO_CATEGORIES[0],
  },
  {
    id: 103,
    name: 'Wireless Charger',
    description: 'Fast charging pad for modern mobile devices.',
    price: 24.99,
    stock: 42,
    category: DEMO_CATEGORIES[0],
  },
  {
    id: 201,
    name: 'Men’s Casual Jacket',
    description: 'Lightweight jacket for everyday wear.',
    price: 59.99,
    stock: 31,
    category: DEMO_CATEGORIES[1],
  },
  {
    id: 202,
    name: 'Women’s Sneakers',
    description: 'Comfortable sneakers with a modern look.',
    price: 74.5,
    stock: 19,
    category: DEMO_CATEGORIES[1],
  },
  {
    id: 301,
    name: 'Air Fryer',
    description: 'Cook crisp meals with less oil.',
    price: 99.0,
    stock: 12,
    category: DEMO_CATEGORIES[2],
  },
  {
    id: 302,
    name: 'Non-Stick Cookware Set',
    description: 'Durable cookware for daily cooking needs.',
    price: 79.95,
    stock: 14,
    category: DEMO_CATEGORIES[2],
  },
  {
    id: 401,
    name: 'Vitamin C Serum',
    description: 'Brighten your skin with daily care.',
    price: 19.99,
    stock: 40,
    category: DEMO_CATEGORIES[3],
  },
  {
    id: 501,
    name: 'Yoga Mat',
    description: 'Premium grip mat for home workouts.',
    price: 29.99,
    stock: 25,
    category: DEMO_CATEGORIES[4],
  },
  {
    id: 601,
    name: 'Bestselling Novel',
    description: 'A compelling read for your next book night.',
    price: 14.99,
    stock: 50,
    category: DEMO_CATEGORIES[5],
  },
  {
    id: 701,
    name: 'iPhone 15 Pro',
    description: 'Latest flagship smartphone with advanced features.',
    price: 999.99,
    stock: 15,
    category: DEMO_CATEGORIES[6],
  },
  {
    id: 702,
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone with stunning display.',
    price: 899.99,
    stock: 20,
    category: DEMO_CATEGORIES[6],
  },
  {
    id: 801,
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop for professionals.',
    price: 2499.99,
    stock: 8,
    category: DEMO_CATEGORIES[7],
  },
  {
    id: 802,
    name: 'Dell XPS 13',
    description: 'Ultrabook with stunning InfinityEdge display.',
    price: 1299.99,
    stock: 12,
    category: DEMO_CATEGORIES[7],
  },
  {
    id: 901,
    name: 'Organic Almond Butter',
    description: 'Natural, creamy almond butter.',
    price: 12.99,
    stock: 100,
    category: DEMO_CATEGORIES[8],
  },
  {
    id: 902,
    name: 'Whole Wheat Bread',
    description: 'Fresh, nutritious whole wheat bread.',
    price: 4.99,
    stock: 50,
    category: DEMO_CATEGORIES[8],
  },
  {
    id: 1001,
    name: 'Modern Wall Clock',
    description: 'Elegant wall clock for any room.',
    price: 29.99,
    stock: 35,
    category: DEMO_CATEGORIES[9],
  },
  {
    id: 1002,
    name: 'LED Table Lamp',
    description: 'Energy-efficient LED table lamp.',
    price: 39.99,
    stock: 28,
    category: DEMO_CATEGORIES[9],
  },
  {
    id: 1101,
    name: 'Gold Necklace',
    description: 'Beautiful 18K gold necklace.',
    price: 349.99,
    stock: 10,
    category: DEMO_CATEGORIES[10],
  },
  {
    id: 1102,
    name: 'Diamond Earrings',
    description: 'Elegant diamond stud earrings.',
    price: 499.99,
    stock: 6,
    category: DEMO_CATEGORIES[10],
  },
  {
    id: 1201,
    name: 'Car Phone Mount',
    description: 'Secure dash mount for phones.',
    price: 19.99,
    stock: 60,
    category: DEMO_CATEGORIES[11],
  },
  {
    id: 1202,
    name: 'Car Air Purifier',
    description: 'Fresh air in your vehicle.',
    price: 34.99,
    stock: 45,
    category: DEMO_CATEGORIES[11],
  },
  {
    id: 1301,
    name: 'Dog Food (5kg)',
    description: 'Nutritious dog food formula.',
    price: 54.99,
    stock: 30,
    category: DEMO_CATEGORIES[12],
  },
  {
    id: 1302,
    name: 'Cat Scratching Post',
    description: 'Interactive cat scratching tower.',
    price: 49.99,
    stock: 25,
    category: DEMO_CATEGORIES[12],
  },
  {
    id: 1401,
    name: 'LEGO City Tower',
    description: 'Large building block set.',
    price: 79.99,
    stock: 22,
    category: DEMO_CATEGORIES[13],
  },
  {
    id: 1402,
    name: 'Board Game Collection',
    description: 'Set of 5 family board games.',
    price: 89.99,
    stock: 18,
    category: DEMO_CATEGORIES[13],
  },
];

const requestProductsApi = async (path, options = {}) => {
  const response = await fetch(`${PRODUCTS_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw createApiError(payload?.message || `Request failed for ${path}`, response.status);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const requestCartApi = async (path, options = {}) => {
  const response = await fetch(`${CART_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw createApiError(payload?.message || `Request failed for ${path}`, response.status);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const normalizeCategory = (category) => ({
  id: Number(category?.id),
  name: String(category?.name || '').trim(),
});

const normalizeProduct = (product) => {
  const categoryId = Number(
    product?.category_id ?? product?.categoryId ?? product?.category?.id ?? 0
  );
  const categoryName = String(
    product?.category_name ?? product?.categoryName ?? product?.category?.name ?? 'Uncategorized'
  ).trim();

  return {
    id: Number(product?.id),
    name: String(product?.name || '').trim(),
    brand_name: product?.brand_name || null,
    seller: String(product?.seller || '').trim() || 'ShopEase Seller',
    seller_rating: product?.seller_rating ? Number(product?.seller_rating) : null,
    seller_type: product?.seller_type || 'Standard',
    seller_location: product?.seller_location || null,
    description: product?.description || '',
    specifications: product?.specifications || {},
    original_price: product?.original_price ? Number(product?.original_price) : null,
    discount_percentage: product?.discount_percentage ? Number(product?.discount_percentage) : 0,
    final_price: product?.final_price ? Number(product?.final_price) : Number(product?.price ?? 0),
    price: Number(product?.price ?? 0),
    stock: Number(product?.stock ?? 0),
    stock_status: product?.stock_status || 'In Stock',
    image_url: product?.image_url || '',
    subcategory_id: product?.subcategory_id || null,
    created_at: product?.created_at || product?.createdAt || null,
    category_id: categoryId,
    category_name: categoryName,
    category: {
      id: categoryId,
      name: categoryName,
    },
  };
};

export const formatCurrencyINR = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const getRoleBasedPath = (role) => (role === 'ADMIN' ? '/admin/dashboard' : '/home');

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

  const { data } = await authClient.post('/login', { email, password });
  const session = persistSession(data?.user || {}, data?.token);

  return {
    ...data,
    ...session,
  };
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

export const getCategories = async () => {
  try {
    const data = await requestProductsApi('/categories');
    return Array.isArray(data) ? data.map(normalizeCategory) : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return DEMO_CATEGORIES.map(normalizeCategory);
  }
};

export const createCategory = async (name) => {
  const trimmedName = String(name || '').trim();

  if (!trimmedName) {
    throw createApiError('Category name is required', 400);
  }

  const data = await requestProductsApi('/categories', {
    method: 'POST',
    body: JSON.stringify({ name: trimmedName }),
  });

  return normalizeCategory(data);
};

export const getProducts = async () => {
  try {
    const data = await requestProductsApi('/products');
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return DEMO_PRODUCTS.map((product) => ({
      ...product,
      seller: product.seller || 'ShopEase Seller',
      image_url: product.image_url || '',
      category_id: product.category?.id || null,
      category_name: product.category?.name || 'Uncategorized',
      category: normalizeCategory(product.category),
    }));
  }
};

export const getProductsByCategory = async (categoryId) => {
  const selectedCategoryId = Number(categoryId);
  const products = await getProducts();
  return products.filter((product) => Number(product.category_id) === selectedCategoryId);
};

export const createProduct = async (payload = {}) => {
  const seller = String(payload.seller || '').trim();

  if (!seller) {
    throw createApiError('Seller is required', 400);
  }

  const data = await requestProductsApi('/products', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      seller: String(payload.seller || '').trim(),
      stock: Number.isFinite(Number(payload.stock)) ? Number(payload.stock) : 0,
      brand_name: payload.brand_name || undefined,
      seller_rating: payload.seller_rating || undefined,
      seller_type: payload.seller_type || 'Standard',
      seller_location: payload.seller_location || undefined,
      specifications: payload.specifications || {},
      original_price: payload.original_price || undefined,
      discount_percentage: payload.discount_percentage || 0,
      final_price: payload.final_price || payload.price,
    }),
  });

  return data ? normalizeProduct(data) : null;
};

export const deleteProduct = async (productId) => {
  if (!Number.isFinite(Number(productId))) {
    throw createApiError('Product ID is required', 400);
  }

  await requestProductsApi(`/products/${productId}`, {
    method: 'DELETE',
  });

  return true;
};

const normalizeCartItem = (item) => ({
  id: Number(item?.id),
  productId: Number(item?.productId),
  quantity: Number(item?.quantity ?? 1),
});

const normalizeCart = (cart) => ({
  id: Number(cart?.id),
  userId: Number(cart?.userId),
  items: Array.isArray(cart?.items) ? cart.items.map(normalizeCartItem) : [],
});

const normalizeAdminUser = (user) => ({
  id: Number(user?.id),
  name: String(user?.name || '').trim(),
  email: String(user?.email || '').trim(),
  role: String(user?.role || 'USER').trim(),
  createdAt: user?.createdAt || null,
  updatedAt: user?.updatedAt || null,
});

export const getCartForUser = async (userId) => {
  const selectedUserId = Number(userId);

  if (!selectedUserId) {
    throw createApiError('User id is required', 400);
  }

  const data = await requestCartApi(`/users/${selectedUserId}`);
  return normalizeCart(data);
};

export const addToCart = async (userId, payload = {}) => {
  const selectedUserId = Number(userId);
  const productId = Number(payload.productId);
  const quantity = Number.isFinite(Number(payload.quantity)) ? Number(payload.quantity) : 1;

  if (!selectedUserId) {
    throw createApiError('User id is required', 400);
  }

  if (!productId) {
    throw createApiError('Product id is required', 400);
  }

  const data = await requestCartApi(`/users/${selectedUserId}/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });

  return normalizeCart(data);
};

export const getCartItemCount = async (userId) => {
  const cart = await getCartForUser(userId);
  return cart.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
};

export const getAllUsers = async () => {
  const { data } = await authClient.get('/users');
  return Array.isArray(data) ? data.map(normalizeAdminUser) : [];
};

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

const api = {
  get: async (url) => {
    if (url === '/api/categories') {
      return { data: await getCategories() };
    }

    if (url === '/api/products') {
      return { data: await getProducts() };
    }

    const categoryProductsMatch = String(url).match(/^\/api\/categories\/(\d+)\/products$/);
    if (categoryProductsMatch) {
      const categoryId = Number(categoryProductsMatch[1]);
      return {
        data: await getProductsByCategory(categoryId),
      };
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

    if (url === '/api/categories') {
      const data = await createCategory(payload?.name);
      return { data };
    }

    if (url === '/api/products') {
      const data = await createProduct(payload);
      return { data };
    }

    throw createApiError(`Unknown endpoint: ${url}`, 404);
  },
};

export default api;
