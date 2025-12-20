import Goal from "../models/Goal.js";

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json({ success: true, data: goals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addGoal = async (req, res) => {
  try {
    const goal = new Goal({
      user: req.user.id,        // 🔥 IMPORTANT
      title: req.body.title,
      targetAmount: req.body.targetAmount,
      currentAmount: req.body.currentAmount || 0,
      deadline: req.body.deadline || null,
    });

    const saved = await goal.save();

    res.json({
      success: true,
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const updated = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
