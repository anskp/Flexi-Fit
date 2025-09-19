// On your BACKEND in Routes/merchantRoutes.js
import express from 'express';
import * as merchantController from '../controllers/merchantController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import roleAuth from '../middlewares/roleAuth.js';
import validate, {
    productSchema,
    updateProductSchema,
    productIdParamSchema
} from '../validators/merchantValidator.js';

const router = express.Router();

// Protect all merchant routes and ensure the user has the 'MERCHANT' role
router.use(jwtAuth, roleAuth('MERCHANT'));

// Product management routes
router.post('/products', validate(productSchema), merchantController.createProduct);
router.get('/products', merchantController.getMyProducts);
router.patch('/products/:productId', validate(productIdParamSchema), validate(updateProductSchema), merchantController.updateMyProduct);
router.delete('/products/:productId', validate(productIdParamSchema), merchantController.deleteMyProduct);

// Order management routes
router.get('/orders', merchantController.getMyOrders);

export default router;