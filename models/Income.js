import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  source: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Income", incomeSchema);
