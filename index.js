import express from "express";
const app = express();
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";

mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected!"));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.listen(8800, () => {
  console.log("Connected");
});

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
