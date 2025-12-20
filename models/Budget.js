import mongoose from "mongoose";

const budgetSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: String,
  limit: Number,
    period: {
    type: String,
    enum: ["monthly", "yearly"],
    default: "monthly",
  },
});

export default mongoose.model("Budget", budgetSchema);
