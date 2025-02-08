const prisma = require("../db/db.config.js");
const { StatusCodes } = require("http-status-codes");

const getComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await prisma.comment.findMany({
    include: {
      user: true,
      post: {
        include: {
          user: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ count: comments.length, comments });
};

const createComment = async (req, res) => {
  const { postId, userId, comment } = req.body;
  // Increasing the comment count
  await prisma.post.update({
    where: {
      id: Number(postId),
    },
    data: {
      comment_count: {
        increment: 1,
      },
    },
  });
  const newComment = await prisma.comment.create({
    data: {
      postId: Number(postId),
      userId: Number(userId),
      comment,
    },
  });

  res.status(StatusCodes.CREATED).json(newComment);
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const updatedComment = await prisma.comment.update({
    where: {
      id: Number(id),
    },
    data: {
      content,
    },
  });
  res.status(StatusCodes.OK).json(updatedComment);
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  // Decreasing the comment count
  await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      comment_count: {
        decrement: 1,
      },
    },
  });
  const deleteComment = await prisma.comment.delete({ where: { id } });
  if (!deleteComment) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Comment not found" });
  }
  res.status(StatusCodes.OK).json({ message: "Comment deleted" });
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
