import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import Income from "../models/Income.js";

export const getDashboardSummary = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id });
  const budgets = await Budget.find({ user: req.user.id });
  const income = await Income.find({ user: req.user.id });

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);

  res.json({
    totalExpense,
    totalBudget,
    totalIncome,
    savings: totalIncome - totalExpense,
    expenses
  });
};

export const getForecast = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id });
  const income = await Income.find({ user: req.user.id });

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);

  const monthlySavings = totalIncome - totalExpense;

  res.json({
    monthlySavings,
    suggestion:
      monthlySavings <= 0
        ? "Reduce expenses or increase income to meet goals"
        : "You are saving well. Stay consistent!",
  });
};