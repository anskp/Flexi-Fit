// src/services/cartService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';
const prisma = new PrismaClient();

// Placeholder for shared Chargebee customer logic
const getOrCreateChargebeeCustomer = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user.chargebeeCustomerId) return user.chargebeeCustomerId;
  console.log(`[STUB] Would create Chargebee customer for user: ${user.email}`);
  const dummyChargebeeId = `cb_stub_${user.id}`;
  await prisma.user.update({ where: { id: userId }, data: { chargebeeCustomerId: dummyChargebeeId } });
  return dummyChargebeeId;
};

export const getUserCart = async (userId) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { addedAt: 'asc' },
  });
};
export const addItemToCart = async (userId, { productId, quantity }) => {
  const product = await prisma.product.findFirst({ where: { id: productId, stock: { gt: 0 } } });
  if (!product) throw new AppError('Product not found or is out of stock.', 404);
  const existingItem = await prisma.cartItem.findUnique({ where: { userId_productId: { userId, productId } } });
  if (existingItem) {
      return await prisma.cartItem.update({
          where: { userId_productId: { userId, productId } },
          data: { quantity: { increment: quantity } }
      });
  } else {
      return await prisma.cartItem.create({
          data: { userId, productId, quantity }
      });
  }
};
export const updateCartItemQuantity = async (userId, cartItemId, quantity) => {
    const cartItem = await prisma.cartItem.findFirst({ where: { id: cartItemId, userId }});
    if (!cartItem) throw new AppError('Cart item not found.', 404);
    return await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
    });
};
export const removeItemFromCart = async (userId, cartItemId) => {
  const cartItem = await prisma.cartItem.findFirst({ where: { id: cartItemId, userId } });
  if (!cartItem) throw new AppError('Cart item not found.', 404);
  await prisma.cartItem.delete({ where: { id: cartItemId } });
};
export const createCartCheckout = async (userId) => {
  const cartItems = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
  if (cartItems.length === 0) throw new AppError('Your cart is empty.', 400);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const chargebeeCustomerId = await getOrCreateChargebeeCustomer(userId);
  console.log(`[STUB] Would create one-time checkout for customer ${chargebeeCustomerId} for amount ${totalAmount}`);
  const dummyCheckoutUrl = `https://your-app.com/test-store-checkout?total=${totalAmount}`;
  return { checkoutUrl: dummyCheckoutUrl, totalAmount };
};

