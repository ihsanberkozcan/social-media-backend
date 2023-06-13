import express from "express";
const router = express.Router();

import {
  deleteUser,
  follow,
  getUser,
  unfollow,
  updateUser,
} from "../controllers/user.js";

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.get("/:id", getUser);

router.put("/:id/follow", follow);

router.put("/:id/unfollow", unfollow);

export default router;
