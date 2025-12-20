import mongoose from "mongoose";

const goalSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  deadline: Date,
});

export default mongoose.model("Goal", goalSchema);
