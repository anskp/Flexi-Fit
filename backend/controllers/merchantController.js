// On your BACKEND in src/controllers/merchantController.js
import * as merchantService from '../services/merchantService.js';
import catchAsync from '../utils/catchAsync.js';

export const createProduct = catchAsync(async (req, res) => {
    const newProduct = await merchantService.createProduct(req.user.id, req.body);
    res.status(201).json({ success: true, data: newProduct });
});
export const getMerchantDashboard = catchAsync(async (req, res) => {
    const dashboardData = await merchantService.getDashboard(req.user.id);
    res.status(200).json({ status: 'success', data: dashboardData });
});

export const getMyProducts = catchAsync(async (req, res) => {
    const products = await merchantService.getMyProducts(req.user.id);
    res.status(200).json({ success: true, data: products });
});

export const updateMyProduct = catchAsync(async (req, res) => {
    const updatedProduct = await merchantService.updateMyProduct(req.user.id, req.params.productId, req.body);
    res.status(200).json({ success: true, data: updatedProduct });
});

export const deleteMyProduct = catchAsync(async (req, res) => {
    await merchantService.deleteMyProduct(req.user.id, req.params.productId);
    res.status(204).send();
});

export const getMyOrders = catchAsync(async (req, res) => {
    const orders = await merchantService.getMyOrders(req.user.id);
    res.status(200).json({ success: true, data: orders });
});