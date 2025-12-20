import express from "express";
import { getForecast } from "../controllers/forecastController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getForecast);

export default router;
