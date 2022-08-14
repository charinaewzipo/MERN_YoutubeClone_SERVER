import mongoose from "mongoose";
import Users_youtube from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
export const signup = async (req, res, next) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new Users_youtube({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created");
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compareSync(
      req.body.password,
      user.password
    ); // true
    if (!isCorrect) return next(createError(404, "Wrong password"));

    const { password, ...others } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    res
      .cookie("access_token", token, {
        httpOnly: true, // try this
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
