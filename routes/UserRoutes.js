const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  getUsers,
  getUserById,
  deleteUser,
} = require("../controllers/Usercontroller");

router.post("/register", createUser);
router.patch("/:id", updateUser);
router.get("/getusers", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

module.exports = router;
