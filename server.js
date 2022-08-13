import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
dotenv.config();
const connect = () => {
  mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log("Connected to MONGODB");
    })
    .catch((err) => {
      throw err;
    });
};

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});
app.listen(8800, () => {
  connect();
  console.log("Connected to server at port 8800");
});
