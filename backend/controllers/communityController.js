// src/controllers/communityController.js
import * as communityService from '../services/communityService.js';
import catchAsync from '../utils/catchAsync.js';

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
