import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getIncome, addIncome } from "../controllers/incomeController.js";

const router = express.Router();
router.get("/", auth, getIncome);
router.post("/", auth, addIncome);

export default router;
