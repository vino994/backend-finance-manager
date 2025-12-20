import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendBrevoEmail from "../utils/sendBrevoEmail.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });   // 🔥 FIXED
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        currency: req.body.currency,
        notifications: req.body.notifications,
        profileImage: req.body.profileImage, // ✅ ADD
      },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    const frontendURL = process.env.FRONTEND_URL;
    const resetLink = `${frontendURL}/reset-password/${token}`;

await sendBrevoEmail({
  to: email,
  subject: "Reset Your Password",
  html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>Password Reset</h2>
      <p>You requested to reset your password.</p>

      <p>
        <a href="${resetLink}" target="_blank">
          👉 Click here to reset your password
        </a>
      </p>

      <p>If the link does not open, copy and paste this URL:</p>

      <p style="word-break: break-all;">
        ${resetLink}
      </p>

      <p>This link expires in 30 minutes.</p>
    </div>
  `,
});




    res.json({ msg: "Password reset link sent to your email" });
  } catch (err) {
    console.error("FORGOT ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Token invalid or expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

