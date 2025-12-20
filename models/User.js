import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    currency: {
      type: String,
      enum: ["INR", "USD", "EUR"],
      default: "INR",
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // 🔐 RESET PASSWORD
  resetToken: String,
  resetTokenExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
