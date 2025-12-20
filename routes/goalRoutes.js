import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  addGoal,
  getGoals,
  updateGoal,
} from "../controllers/goalController.js";

const router = express.Router();

router.get("/", auth, getGoals);
router.post("/", auth, addGoal);
router.put("/:id", auth, updateGoal);

export default router;
