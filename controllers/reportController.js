import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import Budget from "../models/Budget.js";
import User from "../models/User.js";

export const getReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const [expenses, income, budgets, user] = await Promise.all([
      Expense.find({ user: userId }),
      Income.find({ user: userId }),
      Budget.find({ user: userId }),
      User.findById(userId).select("name email currency"),
    ]);

    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const totalIncome = income.reduce((s, i) => s + i.amount, 0);

    res.json({
      user,
      totals: {
        income: totalIncome,
        expense: totalExpense,
        savings: totalIncome - totalExpense,
      },
      expenses,
      income,
      budgets,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to generate report" });
  }
};
