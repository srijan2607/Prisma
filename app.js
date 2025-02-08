const express = require("express");
const app = express();
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require("./routes/UserRoutes");
const postRoutes = require("./routes/PostRoutes");
const commentRoutes = require("./routes/CommentRoutes");

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "Hello World" });
});

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
