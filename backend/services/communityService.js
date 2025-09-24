// src/services/communityService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

// --- Post Services ---

export const createPost = async (authorId, content, imageUrl) => {
  console.log('➡️ [SERVICE] Reached createPost service.');
  console.log(`   - Author ID: ${authorId}`);
  console.log(`   - Image URL: ${imageUrl}`);
  return await prisma.post.create({
    data: { authorId, content, imageUrl },
    include: { author: { select: { id: true, email: true, name: true, avatar: true } } }
  });
};

export const getAllPosts = async ({ page = 1, limit = 10 }) => {
  console.log('➡️ [SERVICE] Reached getAllPosts service.');
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, email: true, name: true, avatar: true } },
        comments: {
            include: { author: { select: { id: true, name: true, avatar: true } } },
            orderBy: { createdAt: 'asc' }
        },
        likes: true,
        _count: { select: { comments: true, likes: true } },
      },
    }),
    prisma.post.count(),
  ]);
  return { data: posts, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } };
};

export const getPostById = async (postId) => {
    console.log('➡️ [SERVICE] Reached getPostById service.');
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: { select: { id: true, email: true, name: true, avatar: true } },
            comments: {
                include: { author: { select: { id: true, email: true, name: true, avatar: true } } },
                orderBy: { createdAt: 'asc' }
            },
            likes: true
        }
    });
    if (!post) throw new AppError('Post not found.', 404);
    return post;
};

export const updatePost = async (authorId, postId, content) => {
  console.log('➡️ [SERVICE] Reached updatePost service.');
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found.', 404);
  if (post.authorId !== authorId) throw new AppError('Forbidden: You can only edit your own posts.', 403);

  return await prisma.post.update({
    where: { id: postId },
    data: { content },
  });
};

export const deletePost = async (authorId, postId) => {
  console.log('➡️ [SERVICE] Reached deletePost service.');
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found.', 404);
  if (post.authorId !== authorId) throw new AppError('Forbidden: You can only delete your own posts.', 403);
  
  await prisma.post.delete({ where: { id: postId } });
};


// --- Comment Services ---

export const createComment = async (authorId, postId, content) => {
    console.log('➡️ [SERVICE] Reached createComment service.');
    const postExists = await prisma.post.count({ where: { id: postId }});
    if (!postExists) throw new AppError('Cannot comment on a post that does not exist.', 404);

    return await prisma.comment.create({
        data: { authorId, postId, content },
        include: { author: { select: { id: true, email: true, name: true, avatar: true } } }
    });
};

export const deleteComment = async (authorId, commentId) => {
    console.log('➡️ [SERVICE] Reached deleteComment service.');
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new AppError('Comment not found.', 404);
    if (comment.authorId !== authorId) throw new AppError('Forbidden: You can only delete your own comments.', 403);

    await prisma.comment.delete({ where: { id: commentId } });
};

// --- Like Service ---

export const likePost = async (userId, postId) => {
  console.log('➡️ [SERVICE] Reached likePost service.');
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: userId,
        postId: postId,
      },
    },
  });

  if (existingLike) {
    // User has already liked the post, so unlike it
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    return { message: 'Post unliked successfully.', data: { liked: false } };
  } else {
    // User has not liked the post, so like it
    await prisma.like.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
    return { message: 'Post liked successfully.', data: { liked: true } };
  }
};