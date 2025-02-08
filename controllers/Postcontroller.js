const prisma = require("../db/db.config.js");
const { StatusCodes } = require("http-status-codes");

// create a new Post

const createPost = async (req, res) => {
  const { title, content, userId } = req.body;
  const newPost = await prisma.post.create({
    data: {
      userId: Number(userId),
      title,
      content,
    },
  });
  res.status(StatusCodes.CREATED).json(newPost);
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updatedPost = await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      title,
      content,
    },
  });
  res.status(StatusCodes.OK).json(updatedPost);
};
const getPost = async (req, res) => {
  const page = Number(req.params.page) || 1;
  const limit = Number(req.query.limit) || 5;
  if (page <= 0) {
    limit = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const posts = await prisma.post.findMany({
    skip: (page - 1) * limit, // Calculate the number of items to skip skip = (2 - 1) * 10 = 1 * 10 = 10
    take: limit,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  const total_posts = await prisma.post.count();
  const totalPages = Math.ceil(total_posts / total);
  res.status(StatusCodes.OK).json({
    count: posts.length,
    posts,
    totalPages,
    total_posts,
    limit: limit,
  });
};
const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findFirst({ where: { id: Number(id) } });
  if (!post) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Post not found" });
  }
  res.status(StatusCodes.OK).json(post);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const deletePost = await prisma.post.delete({ where: { id } });
  if (!deletePost) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Post not found" });
  }
  res.status(StatusCodes.OK).json({ message: "Post deleted" });
};

// for search post

const searchPost = async (req, res) => {
  const query = req.query.ser;
  const posts = await prisma.post.findMany({
    where: {
      content: {
        search: query,
        mode: "insensitive",
      },
    },
  });
  res.status(StatusCodes.OK).json({ count: posts.length, posts });
};

// Export the functions
module.exports = {
  createPost,
  updatePost,
  getPost,
  getPostById,
  deletePost,
  searchPost,
};
