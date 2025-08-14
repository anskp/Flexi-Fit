// src/controllers/cartController.js
import * as cartService from '../services/cartService.js';
import catchAsync from '../utils/catchAsync.js';

export const getMyCart = catchAsync(async (req, res) => {
  const cart = await cartService.getUserCart(req.user.id);
  res.status(200).json({ success: true, data: cart });
});

export const addToCart = catchAsync(async (req, res) => {
  const updatedItem = await cartService.addItemToCart(req.user.id, req.body);
  res.status(200).json({ success: true, message: 'Item added to cart.', data: updatedItem });
});

export const updateCartItem = catchAsync(async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const updatedItem = await cartService.updateCartItemQuantity(req.user.id, cartItemId, quantity);
    res.status(200).json({ success: true, message: 'Cart updated.', data: updatedItem });
});

export const removeFromCart = catchAsync(async (req, res) => {
  await cartService.removeItemFromCart(req.user.id, req.params.cartItemId);
  res.status(204).send();
});

export const createCheckout = catchAsync(async (req, res) => {
  const result = await cartService.createCartCheckout(req.user.id);
  res.status(200).json({ success: true, data: result });
});

