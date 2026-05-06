import express from "express";
import { getJarvisResponse } from "../controllers/jarvisController.js";

const router = express.Router();

router.post("/chat", getJarvisResponse);

export default router;
