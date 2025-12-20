import Expense from "../models/Expense.js";

export const getForecast = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id });

  const monthly = {};

  expenses.forEach(e => {
    const month = new Date(e.date).toISOString().slice(0, 7);
    monthly[month] = (monthly[month] || 0) + e.amount;
  });

  const avg =
    Object.values(monthly).reduce((a, b) => a + b, 0) /
    Object.values(monthly).length || 0;

  res.json({
    averageMonthlyExpense: Math.round(avg),
    nextMonthForecast: Math.round(avg * 1.05), // 5% inflation
  });
};
