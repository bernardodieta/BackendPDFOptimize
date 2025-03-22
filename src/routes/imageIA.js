import express from "express";
import { generateImage } from "../controllers/imageIA.js";
const router = express.Router();

router.post("/generator", generateImage);

export default router;
