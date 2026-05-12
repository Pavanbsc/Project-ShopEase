import { Router } from 'express';
import { createCategory, getCategories, getCategoryProducts } from '../controllers/categoryController.js';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.get('/categories/:categoryId/products', getCategoryProducts);

export default router;
