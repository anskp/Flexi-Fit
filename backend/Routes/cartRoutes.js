// Routes/cartRoutes.js
import express from 'express';
import * as cartController from '../controllers/cartController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import validate, {
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdParamSchema
} from '../validators/cartValidator.js';

const router = express.Router();

// All cart actions are for authenticated users
router.use(jwtAuth);

router.get('/', cartController.getMyCart);
router.post('/', validate(addToCartSchema), cartController.addToCart);
router.patch('/:cartItemId', validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/:cartItemId', validate(cartItemIdParamSchema), cartController.removeFromCart);
router.post('/checkout', cartController.createCheckout);

export default router;

