import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  getPostBySlug,
  getRelatedPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPosts).post(protect, createPost);
router.get("/slug/:slug", getPostBySlug);
router.get("/:id/related", getRelatedPosts);
router
  .route("/:id")
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
