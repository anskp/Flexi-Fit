// Routes/auth0CommunityRoutes.js
import express from 'express';
import * as communityController from '../controllers/communityController.js';
import auth0Auth from '../middlewares/auth0Auth.js';

const router = express.Router();

// Auth0 protected community routes
router.get('/posts', auth0Auth, communityController.getCommunityPosts);
router.post('/posts', auth0Auth, communityController.createPost);
router.get('/posts/:id', auth0Auth, communityController.getPostById);
router.put('/posts/:id', auth0Auth, communityController.updatePost);
router.delete('/posts/:id', auth0Auth, communityController.deletePost);
router.post('/posts/:id/like', auth0Auth, communityController.likePost);
router.post('/posts/:id/comment', auth0Auth, communityController.addComment);

export default router;
