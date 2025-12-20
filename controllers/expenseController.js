import Expense from "../models/Expense.js";
import { checkBudgetAlert } from "./budgetController.js";


export const createExpense = async (req, res) => {
  const expense = await Expense.create({ ...req.body, user: req.user.id });

  await checkBudgetAlert(req.user.id, expense.category);

  res.json(expense);
};

// ==========================
// GET EXPENSES
// ==========================
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch expenses" });
  }
};

// ==========================
// ADD EXPENSE
// ==========================
export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      amount: Number(req.body.amount),
      category: req.body.category,
      date: req.body.date,
      isRecurring: req.body.isRecurring || false,
      frequency: req.body.frequency || null,
      lastGenerated: req.body.isRecurring ? new Date(req.body.date) : null,
    });

    res.json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add expense" });
  }
};

// ==========================
// UPDATE EXPENSE ✅
// ==========================
export const updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: req.body.title,
        description: req.body.description,
        amount: Number(req.body.amount),
        category: req.body.category,
        date: req.body.date,
        isRecurring: req.body.isRecurring || false,
        frequency: req.body.frequency || null,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update expense" });
  }
};

// ==========================
// DELETE EXPENSE ✅
// ==========================
export const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete expense" });
  }
};

// ==========================
// 🔁 GENERATE MONTHLY RECURRING EXPENSES (UNCHANGED)
// ==========================
export const generateRecurringExpenses = async () => {
  try {
    const recurring = await Expense.find({ isRecurring: true });
    const now = new Date();

    for (let exp of recurring) {
      const last = exp.lastGenerated || exp.date;

      const sameMonth =
        last.getMonth() === now.getMonth() &&
        last.getFullYear() === now.getFullYear();

      if (!sameMonth) {
        await Expense.create({
          user: exp.user,
          title: exp.title,
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          date: now,
        });

        exp.lastGenerated = now;
        await exp.save();
      }
    }
  } catch (err) {
    console.error("Recurring expense error:", err.message);
  }
};
