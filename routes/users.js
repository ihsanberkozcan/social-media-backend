import express from "express";
const router = express.Router();

import {
  deleteUser,
  follow,
  getUser,
  searchUser,
  unfollow,
  updateUser,
} from "../controllers/user.js";

import { auth } from "../middleware/auth.js";

router.get("/search", searchUser);

router.put("/:id", auth, updateUser);

router.delete("/:id", auth, deleteUser);

router.get("/:id", auth, getUser);

router.put("/:id/follow", auth, follow);

router.put("/:id/unfollow", auth, unfollow);


export default router;
