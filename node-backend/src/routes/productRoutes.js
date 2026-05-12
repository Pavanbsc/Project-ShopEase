import { Router } from 'express';
import { createProduct, getProducts, deleteProduct } from '../controllers/productController.js';

const router = Router();

router.get('/products', getProducts);
router.post('/products', createProduct);
router.delete('/products/:id', deleteProduct);

export default router;
