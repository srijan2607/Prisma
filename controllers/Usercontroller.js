const prisma = require("../db/db.config.js");
const { StatusCodes } = require("http-status-codes");

// create a new user

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (findUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "User already exists" });
  }
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  res.status(StatusCodes.CREATED).json(newUser);
};

// update user by id

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name,
      email,
      password,
    },
  });
  res.status(StatusCodes.OK).json(updatedUser);
};

// to get the list of all users
const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    include: { posts: true, comment: true },
  });
  res.status(StatusCodes.OK).json(users);
};

// to get user by id

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findFirst({
    where: { id: Number(id) },
    include: { posts: true, comment: true },
  });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }
  res.status(StatusCodes.OK).json(user);
};

// Delete user by id

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const deleteUser = await prisma.user.delete({ where: { id } });
  if (!deleteUser) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }
  res.status(StatusCodes.OK).json({ message: "User deleted" });
};

// Export the functions
module.exports = {
  createUser,
  updateUser,
  getUsers,
  getUserById,
  deleteUser,
};
