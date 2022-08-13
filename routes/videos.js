import express from "express";
import { getAllUser } from "../controllers/user.js";
import {
  addVideo,
  addView,
  getAllVideo,
  getByTags,
  getVideo,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, addVideo);
router.get("/find/:id", getVideo);
router.get("/all", verifyToken, getAllVideo);
router.put("/view/:id", addView);
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub", verifyToken, sub);
router.get("/tags", getByTags);
router.get("/search", search);

export default router;
