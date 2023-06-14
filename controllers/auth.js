import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secret = process.env.JWT_SECRET;

// register controller
export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "1h",
    });
    const { password, updatedAt, isAdmin, ...other } = user._doc;
    res.status(201).json({ other, token });
  } catch (error) {
    res.status(500).json(error);
  }
  // res.send("ok");
};

// login controller
export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json("user not found");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json("wrong password");
    } else {
      const token = jwt.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "1h",
      });
      const { password, updatedAt, isAdmin, ...other } = user._doc;
      return res.status(200).json({ other, token });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
