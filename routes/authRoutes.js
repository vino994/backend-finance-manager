import express from "express";
import {
  register,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, (req, res) => res.json({ user: req.user }));
router.put("/profile", auth, updateProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
