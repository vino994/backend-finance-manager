import Income from "../models/Income.js";

export const getIncome = async (req, res) => {
  const income = await Income.find({ user: req.user.id });
  res.json({ success: true, data: income });
};

export const addIncome = async (req, res) => {
  const income = await Income.create({
    user: req.user.id,
    source: req.body.source,
    amount: Number(req.body.amount), // ✅ FIX
    date: req.body.date || new Date(),
  });
  res.json({ success: true, data: income });
};
