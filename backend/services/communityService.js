// src/services/communityService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

// --- Post Services ---

export const createPost = async (authorId, content) => {
  return await prisma.post.create({
    data: { authorId, content },
    include: { author: { select: { id: true, email: true } } }
  });
};

export const getAllPosts = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, email: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.post.count(),
  ]);
  return { data: posts, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getPostById = async (postId) => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: { select: { id: true, email: true } },
            comments: {
                include: { author: { select: { id: true, email: true } } },
                orderBy: { createdAt: 'asc' }
            }
        }
    });
    if (!post) throw new AppError('Post not found.', 404);
    return post;
};

export const updatePost = async (authorId, postId, content) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found.', 404);
  if (post.authorId !== authorId) throw new AppError('Forbidden: You can only edit your own posts.', 403);

  return await prisma.post.update({
    where: { id: postId },
    data: { content },
  });
};

export const deletePost = async (authorId, postId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found.', 404);
  if (post.authorId !== authorId) throw new AppError('Forbidden: You can only delete your own posts.', 403);
  
  await prisma.post.delete({ where: { id: postId } });
};


// --- Comment Services ---

export const createComment = async (authorId, postId, content) => {
    // Ensure the post exists before allowing a comment
    const postExists = await prisma.post.count({ where: { id: postId }});
    if (!postExists) throw new AppError('Cannot comment on a post that does not exist.', 404);

    return await prisma.comment.create({
        data: { authorId, postId, content },
        include: { author: { select: { id: true, email: true } } }
    });
};

export const deleteComment = async (authorId, commentId) => {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new AppError('Comment not found.', 404);
    if (comment.authorId !== authorId) throw new AppError('Forbidden: You can only delete your own comments.', 403);

    await prisma.comment.delete({ where: { id: commentId } });
};

