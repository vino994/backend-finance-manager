import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getReports } from "../controllers/reportController.js";

const router = express.Router();
router.get("/", auth, getReports);
export default router;
