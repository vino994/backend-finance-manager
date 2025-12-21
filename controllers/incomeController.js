import Income from "../models/Income.js";

/* ================= GET ================= */
export const getIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id }).sort({ date: -1 });

    res.json({
      success: true,
      data: income,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

/* ================= ADD ================= */
export const addIncome = async (req, res) => {
  try {
    const { source, amount, date } = req.body;

    if (!source || !amount) {
      return res.status(400).json({
        success: false,
        msg: "Source and amount required",
      });
    }

    const income = await Income.create({
      user: req.user.id,
      source,
      amount: Number(amount),
      date: date || new Date(),
    });

    res.json({
      success: true,
      data: income,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

/* ================= UPDATE ================= */
export const updateIncome = async (req, res) => {
  try {
    const updated = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        msg: "Income not found",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

/* ================= DELETE ================= */
export const deleteIncome = async (req, res) => {
  try {
    const deleted = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        msg: "Income not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
