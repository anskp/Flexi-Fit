// src/api/merchantService.js
import apiClient from './apiClient';

// === Product Management ===

/**
 * @description Fetches all products for the logged-in merchant.
 * Calls: GET /api/merchant/products
 */
export const getMyProducts = async () => {
    const response = await apiClient.get('/merchant/products');
    return response.data;
};

/**
 * @description Creates a new product for the logged-in merchant.
 * Calls: POST /api/merchant/products
 * @param {object} productData - e.g., { name, description, price, stock }
 */
export const createProduct = async (productData) => {
    const response = await apiClient.post('/merchant/products', productData);
    return response.data;
};

/**
 * @description Updates an existing product.
 * Calls: PATCH /api/merchant/products/:productId
 * @param {string} productId - The ID of the product to update.
 * @param {object} updateData - The fields to update.
 */
export const updateProduct = async (productId, updateData) => {
    const response = await apiClient.patch(`/merchant/products/${productId}`, updateData);
    return response.data;
};

/**
 * @description Deletes a product.
 * Calls: DELETE /api/merchant/products/:productId
 * @param {string} productId - The ID of the product to delete.
 */
export const deleteProduct = async (productId) => {
    await apiClient.delete(`/merchant/products/${productId}`);
};


// === Order Management ===

/**
 * @description Fetches all orders for the logged-in merchant.
 * Calls: GET /api/merchant/orders
 */
export const getMyOrders = async () => {
    const response = await apiClient.get('/merchant/orders');
    return response.data;
};