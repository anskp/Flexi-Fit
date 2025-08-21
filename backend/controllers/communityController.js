// src/controllers/communityController.js
import * as communityService from '../services/communityService.js';
import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to get user ID from either JWT or Auth0
const getUserId = async (req) => {
  // If Auth0 middleware was used
  if (req.auth?.payload) {
    console.log('[CommunityController] Using Auth0 user ID from payload');
    // Get our DB user ID from Auth0 sub
    const user = await authService.getUserByAuth0Id(req.auth.payload.sub);
    return user.id;
  }
  // If JWT middleware was used
  console.log('[CommunityController] Using JWT user ID');
  return req.user?.id;
};

// --- Post Controllers ---
export const createPost = catchAsync(async (req, res) => {
  const newPost = await communityService.createPost(req.user.id, req.body.content);
  res.status(201).json({ success: true, message: 'Post created successfully.', data: newPost });
});

export const getAllPosts = catchAsync(async (req, res) => {
  const result = await communityService.getAllPosts(req.query);
  res.status(200).json({ success: true, ...result });
});

export const getPostById = catchAsync(async (req, res) => {
    const post = await communityService.getPostById(req.params.postId);
    res.status(200).json({ success: true, data: post });
});

export const updatePost = catchAsync(async (req, res) => {
  const updatedPost = await communityService.updatePost(req.user.id, req.params.postId, req.body.content);
  res.status(200).json({ success: true, message: 'Post updated successfully.', data: updatedPost });
});

export const deletePost = catchAsync(async (req, res) => {
  await communityService.deletePost(req.user.id, req.params.postId);
  res.status(204).send();
});


// --- Comment Controllers ---
export const createComment = catchAsync(async (req, res) => {
  const newComment = await communityService.createComment(req.user.id, req.params.postId, req.body.content);
  res.status(201).json({ success: true, message: 'Comment added successfully.', data: newComment });
});

export const deleteComment = catchAsync(async (req, res) => {
  await communityService.deleteComment(req.user.id, req.params.commentId);
  res.status(204).send();
});

// Auth0-specific community endpoints
export const getCommunityPosts = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const result = await communityService.getAllPosts(req.query);
  res.status(200).json({ success: true, ...result });
});

export const likePost = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const result = await communityService.likePost(userId, req.params.id);
  res.status(200).json({ success: true, message: 'Post liked successfully.', data: result });
});

export const addComment = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const newComment = await communityService.createComment(userId, req.params.id, req.body.content);
  res.status(201).json({ success: true, message: 'Comment added successfully.', data: newComment });
});
