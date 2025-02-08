const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  getPost,
  getPostById,
  deletePost,
  searchPost,
} = require("../controllers/Postcontroller");

router.post("/create", createPost);
router.patch("/:id", updatePost);
router.get("/getpost", getPost);
router.get("/getpost/:id", getPostById);
router.delete("/:id", deletePost);
router.get("/search", searchPost);

module.exports = router;
