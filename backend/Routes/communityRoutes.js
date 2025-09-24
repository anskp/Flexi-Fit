// src/routes/communityRoutes.js
import express from 'express';
import * as communityController from '../controllers/communityController.js';
import { auth0Middleware } from '../middlewares/auth0Middleware.js';
import upload from '../middlewares/upload.js';
import validate, {
  postContentSchema,
  commentContentSchema,
  postIdParamSchema,
  commentIdParamSchema,
  paginationSchema
} from '../validators/communityValidator.js';

const router = express.Router();

// --- Post Routes ---

// GET all posts
router.get(
    '/posts',
    validate(paginationSchema),
    communityController.getAllPosts
);

// GET a single post
router.get(
    '/posts/:postId',
    validate(postIdParamSchema),
    communityController.getPostById
);

// POST to create a new post
router.post(
  '/posts',
  auth0Middleware,         // 1. Validate the user token
  upload.single('image'),  // 2. Handle the file upload
  validate(postContentSchema), // 3. Validate the text content
  communityController.createPost
);

// POST to like/unlike a post
router.post(
  '/posts/:postId/like',
  auth0Middleware,
  validate(postIdParamSchema),
  communityController.likePost
);

// PUT to update a post
router.put(
  '/posts/:postId',
  auth0Middleware,
  validate(postIdParamSchema),
  validate(postContentSchema),
  communityController.updatePost
);

// DELETE a post
router.delete(
  '/posts/:postId',
  auth0Middleware,
  validate(postIdParamSchema),
  communityController.deletePost
);

// --- Comment Routes ---

// POST to create a comment
router.post(
  '/posts/:postId/comments',
  auth0Middleware,
  validate(postIdParamSchema),
  validate(commentContentSchema),
  communityController.createComment
);

// DELETE a comment
router.delete(
  '/comments/:commentId',
  auth0Middleware,
  validate(commentIdParamSchema),
  communityController.deleteComment
);

export default router;