import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  addBudget,
  getBudgets,
} from "../controllers/budgetController.js";

const router = express.Router();

router.get("/", auth, getBudgets);
router.post("/", auth, addBudget);

export default router;
