import express from "express";
const router = express.Router();

import {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likePost,
  updatePost,
} from "../controllers/post.js";
import { auth } from "../middleware/auth.js";

// create post
router.post("/", auth, createPost);

// update post
router.put("/:id", auth, updatePost);

// delete post
router.delete("/:id", auth, deletePost);

// like post
router.put("/:id/like", auth, likePost);

// get a post
router.get("/:id", getPost);

//get timeline posts
router.get("/timeline/all", auth, getTimelinePosts);

export default router;
