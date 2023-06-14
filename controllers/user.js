import bcrypt from "bcrypt";
import User from "../models/User.js";

export const updateUser = async (req, res) => {
  if (req.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
};

export const deleteUser = async (req, res) => {
  if (req.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const follow = async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.userId);
      if (!user.followers.includes(req.userId)) {
        await user.updateOne({ $push: { followers: req.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can not follow yourself");
  }
};

export const unfollow = async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.userId);
      if (user.followers.includes(req.userId)) {
        await user.updateOne({ $pull: { followers: req.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can not unfollow yourself");
  }
};

export const searchUser = async (req, res) => {
  try {
    const searchTerm = req.query.username;
    const regex = new RegExp(`^${searchTerm}`);
    const users = await User.find({ username: regex }).limit(5);
    const returnUsers = users.map((user) => {
      const { password, updatedAt, ...other } = user._doc;
      return other;
    });
    return res.status(200).json(returnUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
