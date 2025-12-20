// routes/dashboardRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import Income from "../models/Income.js";
import { getForecast } from "../controllers/dashboardController.js";

const router = express.Router();

/* =========================
   DASHBOARD SUMMARY
========================= */
router.get("/summary", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const budgets = await Budget.find({ user: req.user.id });
    const income = await Income.find({ user: req.user.id });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

    res.json({
      expenses,
      totalExpense,
      totalBudget,
      totalIncome,
      savings: totalIncome - totalExpense,
      remainingBudget: totalBudget - totalExpense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
});

/* =========================
   FINANCIAL FORECAST
========================= */
router.get("/forecast", auth, getForecast);

export default router;
