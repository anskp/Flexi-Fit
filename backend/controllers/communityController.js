// src/controllers/communityController.js
import * as communityService from '../services/communityService.js';
import catchAsync from '../utils/catchAsync.js';

// --- Post Controllers ---
export const createPost = catchAsync(async (req, res) => {
  console.log('➡️ [CONTROLLER] Reached createPost controller.');
  
  if (!req.file) {
    console.log('❌ [CONTROLLER] File not found on req.file. Upload failed or was missing.');
    return res.status(400).json({ success: false, message: 'Post image is required.' });
  }
  
  console.log('✅ [CONTROLLER] Image file received:', req.file);
  console.log('✅ [CONTROLLER] Post content received:', req.body.content);
  
  // The full path for the image URL, to be stored in the database
  const imageUrl = `/uploads/${req.file.filename}`;
  
  // req.user.id is guaranteed to exist by the auth0Middleware
  const newPost = await communityService.createPost(req.user.id, req.body.content, imageUrl);
  res.status(201).json({ success: true, message: 'Post created successfully.', data: newPost });
});

export const getAllPosts = catchAsync(async (req, res) => {
  console.log('➡️ [CONTROLLER] Reached getAllPosts controller.');
  const result = await communityService.getAllPosts(req.query);
  res.status(200).json({ success: true, ...result });
});

export const getPostById = catchAsync(async (req, res) => {
    console.log('➡️ [CONTROLLER] Reached getPostById controller.');
    const post = await communityService.getPostById(req.params.postId);
    res.status(200).json({ success: true, data: post });
});

export const updatePost = catchAsync(async (req, res) => {
  console.log('➡️ [CONTROLLER] Reached updatePost controller.');
  const updatedPost = await communityService.updatePost(req.user.id, req.params.postId, req.body.content);
  res.status(200).json({ success: true, message: 'Post updated successfully.', data: updatedPost });
});

export const deletePost = catchAsync(async (req, res) => {
  console.log('➡️ [CONTROLLER] Reached deletePost controller.');
  await communityService.deletePost(req.user.id, req.params.postId);
  res.status(204).send();
});

// --- Like Controller ---
export const likePost = catchAsync(async (req, res) => {
  console.log('➡️ [CONTROLLER] Reached likePost controller.');
  const userId = req.user.id;
  const result = await communityService.likePost(userId, req.params.postId);
  res.status(200).json({ success: true, message: result.message, data: result.data });
});

// --- Comment Controllers ---
export const createComment = catchAsync(async (req, res) => {
  console.log('➡️ [CONTROLLER] Reached createComment controller.');
  const newComment = await communityService.createComment(req.user.id, req.params.postId, req.body.content);
  res.status(201).json({ success: true, message: 'Comment added successfully.', data: newComment });
});

export const deleteComment = catchAsync(async (req, res) => {
  console.log('➡️ [CONTROLLER] Reached deleteComment controller.');
  await communityService.deleteComment(req.user.id, req.params.commentId);
  res.status(204).send();
});