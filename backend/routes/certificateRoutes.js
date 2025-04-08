// backend/routes/certificateRoutes.js
import express from "express";
import { generateCertificate } from "../controllers/certificateController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// GET request with authentication
router.get("/generate", isAuthenticated, generateCertificate);

export default router;
