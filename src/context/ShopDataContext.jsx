import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getCategories } from '../services/api';

const ShopDataContext = createContext(null);

const FALLBACK_CATEGORY_NAMES = [
  'Mobiles',
  'Laptops',
  'Electronics',
  'Fashion',
  'Watches',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Books',
  'Groceries',
  'Jewelry',
  'Automotive',
  'Pet Supplies',
  'Toys & Games',
];

const slugify = (text) =>
  String(text || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const FALLBACK_CATEGORIES = FALLBACK_CATEGORY_NAMES.map((name, index) => ({
  id: index + 1,
  name,
  slug: slugify(name),
  description: `Explore premium ${name.toLowerCase()} deals curated for ShopEase shoppers.`,
  fallback: true,
}));

export function ShopDataProvider({ children }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const hasLoadedCategories = useRef(false);

  const loadCategories = useCallback(async () => {
    if (hasLoadedCategories.current) {
      return;
    }

    try {
      setIsLoadingCategories(true);
      setCategoriesError('');
      const data = await getCategories();
      if (data.length) {
        setCategories(data);
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
      hasLoadedCategories.current = true;
    } catch (error) {
      setCategories(FALLBACK_CATEGORIES);
      setCategoriesError('Backend categories are unavailable. Showing curated ShopEase categories.');
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      setCategoriesError('');
      const data = await getCategories();
      setCategories(data.length ? data : FALLBACK_CATEGORIES);
      hasLoadedCategories.current = true;
    } catch (error) {
      setCategories(FALLBACK_CATEGORIES);
      setCategoriesError('Backend refresh failed. Showing curated ShopEase categories.');
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const categoryById = useMemo(() => {
    return categories.reduce((accumulator, category) => {
      accumulator[String(category.id)] = category;
      return accumulator;
    }, {});
  }, [categories]);

  const categoryBySlug = useMemo(() => {
    return categories.reduce((accumulator, category) => {
      if (category && category.slug) {
        accumulator[String(category.slug)] = category;
      }
      return accumulator;
    }, {});
  }, [categories]);

  const value = useMemo(
    () => ({
      categories,
      categoryById,
      categoryBySlug,
      isLoadingCategories,
      categoriesError,
      refreshCategories,
    }),
    [categories, categoryById, categoryBySlug, isLoadingCategories, categoriesError, refreshCategories]
  );

  return <ShopDataContext.Provider value={value}>{children}</ShopDataContext.Provider>;
}

export function useShopData() {
  const context = useContext(ShopDataContext);

  if (!context) {
    throw new Error('useShopData must be used within a ShopDataProvider');
  }

  return context;
}
