import express from "express";
import { optimizePdf } from "../controllers/pdfController.js";

const router = express.Router();

router.post("/", optimizePdf);

export default router;
