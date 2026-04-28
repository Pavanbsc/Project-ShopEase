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

export const DEMO_CATEGORIES = [
  { id: 1, name: 'Electronics', description: 'Smart devices, accessories, and gadgets.' },
  { id: 2, name: 'Fashion', description: 'Trending styles for every season.' },
  { id: 3, name: 'Home & Kitchen', description: 'Essentials for a comfortable home.' },
  { id: 4, name: 'Beauty', description: 'Skincare, grooming, and self-care products.' },
  { id: 5, name: 'Sports', description: 'Gear up with fitness and outdoor items.' },
  { id: 6, name: 'Books', description: 'Best-selling books and learning resources.' },
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
];

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

export const getCategories = async () => DEMO_CATEGORIES;

export const getProducts = async () => DEMO_PRODUCTS;

export const getProductsByCategory = async (categoryId) => {
  const id = Number(categoryId);
  return DEMO_PRODUCTS.filter((product) => Number(product.category?.id) === id);
};

const api = {
  get: async (url) => {
    if (url === '/api/categories') {
      return { data: DEMO_CATEGORIES };
    }

    if (url === '/api/products') {
      return { data: DEMO_PRODUCTS };
    }

    const categoryProductsMatch = String(url).match(/^\/api\/categories\/(\d+)\/products$/);
    if (categoryProductsMatch) {
      const categoryId = Number(categoryProductsMatch[1]);
      return {
        data: DEMO_PRODUCTS.filter((product) => Number(product.category?.id) === categoryId),
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

    throw createApiError(`Unknown endpoint: ${url}`, 404);
  },
};

export default api;
