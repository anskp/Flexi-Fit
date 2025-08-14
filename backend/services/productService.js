// src/services/productService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';
const prisma = new PrismaClient();

// --- Admin Product Management ---
export const createProduct = async (productData) => {
  return await prisma.product.create({ data: productData });
};

export const updateProduct = async (productId, updateData) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found.', 404);
  return await prisma.product.update({ where: { id: productId }, data: updateData });
};

export const deleteProduct = async (productId) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError('Product not found.', 404);
    // Note: Deleting a product could cascade to cart items. Handle this gracefully.
    await prisma.product.delete({ where: { id: productId } });
};

// --- Public Product Discovery ---
export const getAllProducts = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const whereClause = { stock: { gt: 0 } }; // Only show in-stock products
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({ where: whereClause, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where: whereClause }),
  ]);
  return { data: products, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getProductById = async (productId) => {
    const product = await prisma.product.findUnique({ where: { id: productId }});
    if (!product) throw new AppError('Product not found.', 404);
    return product;
};

