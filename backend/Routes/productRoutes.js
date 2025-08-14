// Routes/productRoutes.js
import express from 'express';
import * as productController from '../controllers/productController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import adminAuth from '../middlewares/adminAuth.js';
import validate, {
    createProductSchema,
    updateProductSchema,
    productIdParamSchema,
    paginationSchema
} from '../validators/productValidator.js';

const router = express.Router();

// --- Public Routes ---
router.get('/', validate(paginationSchema), productController.getAllProducts);
router.get('/:id', validate(productIdParamSchema), productController.getProductById);

// --- Admin-Only Product Management Routes ---
router.post('/', jwtAuth, adminAuth, validate(createProductSchema), productController.createProduct);
router.put('/:id', jwtAuth, adminAuth, validate(productIdParamSchema), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', jwtAuth, adminAuth, validate(productIdParamSchema), productController.deleteProduct);

export default router;
