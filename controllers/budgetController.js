import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import sendEmail from "../utils/sendBrevoEmail.js";

export const checkBudgetAlert = async (userId, category) => {
  const budget = await Budget.findOne({ user: userId, category });
  if (!budget) return;

  const expenses = await Expense.find({ user: userId, category });
  const spent = expenses.reduce((s, e) => s + e.amount, 0);

  if (spent > budget.limit) {
    await sendEmail({
      to: budget.user.email,
      subject: "⚠ Budget Exceeded Alert",
      html: `
        <h3>Budget Exceeded</h3>
        <p>You exceeded your <b>${category}</b> budget.</p>
        <p>Limit: ${budget.limit}</p>
        <p>Spent: ${spent}</p>
      `,
    });
  }
};
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });

    res.json({
      success: true,
      data: budgets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addBudget = async (req, res) => {
  try {
    const budget = await Budget.create({
      ...req.body,
      user: req.user.id,
    });

    res.json({
      success: true,
      data: budget,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
