import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import forecastRoutes from "./routes/forecastRoutes.js";

import { generateRecurringExpenses } from "./controllers/expenseController.js";

dotenv.config();
console.log("ENV CHECK → BREVO:", process.env.BREVO_API_KEY);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());

connectDB().then(() => {
  console.log("MongoDB connected");
  generateRecurringExpenses();
  setInterval(generateRecurringExpenses, 24 * 60 * 60 * 1000);
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Personal Finance Manager API running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/forecast", forecastRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
