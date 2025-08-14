// src/controllers/productController.js
import * as productService from '../services/productService.js';
import catchAsync from '../utils/catchAsync.js';

// --- Admin ---
export const createProduct = catchAsync(async (req, res) => {
  const newProduct = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: newProduct });
});

export const updateProduct = catchAsync(async (req, res) => {
  const updatedProduct = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({ success: true, data: updatedProduct });
});

export const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).send();
});

// --- Public ---
export const getAllProducts = catchAsync(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  res.status(200).json({ success: true, ...result });
});

export const getProductById = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
});

