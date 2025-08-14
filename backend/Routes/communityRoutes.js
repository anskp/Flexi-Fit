// Routes/communityRoutes.js
import express from 'express';
import * as communityController from '../controllers/communityController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import validate, {
  postContentSchema,
  commentContentSchema,
  postIdParamSchema,
  commentIdParamSchema,
  paginationSchema
} from '../validators/communityValidator.js';

const router = express.Router();

// --- Post Routes ---

// GET all posts (publicly accessible, but could require auth if you choose)
router.get(
    '/posts',
    validate(paginationSchema),
    communityController.getAllPosts
);

// GET a single post and its comments (publicly accessible)
router.get(
    '/posts/:postId',
    validate(postIdParamSchema),
    communityController.getPostById
);

// POST to create a new post (requires auth)
router.post(
  '/posts',
  jwtAuth,
  validate(postContentSchema),
  communityController.createPost
);

// PUT to update a user's own post (requires auth)
router.put(
  '/posts/:postId',
  jwtAuth,
  validate(postIdParamSchema), // Validate the param
  validate(postContentSchema),  // Validate the body
  communityController.updatePost
);

// DELETE a user's own post (requires auth)
router.delete(
  '/posts/:postId',
  jwtAuth,
  validate(postIdParamSchema),
  communityController.deletePost
);


// --- Comment Routes ---

// POST to create a comment on a post (requires auth)
router.post(
  '/posts/:postId/comments',
  jwtAuth,
  validate(postIdParamSchema),
  validate(commentContentSchema),
  communityController.createComment
);

// DELETE a user's own comment (requires auth)
router.delete(
  '/comments/:commentId',
  jwtAuth,
  validate(commentIdParamSchema),
  communityController.deleteComment
);


export default router;

