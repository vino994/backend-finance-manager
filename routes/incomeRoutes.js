import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getIncome,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController.js";

const router = express.Router();

router.get("/", auth, getIncome);
router.post("/", auth, addIncome);

/* 🔥 REQUIRED FOR EDIT */
router.put("/:id", auth, updateIncome);

/* 🔥 REQUIRED FOR DELETE */
router.delete("/:id", auth, deleteIncome);

export default router;
