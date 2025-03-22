import express from "express";
//import { getComplementaryColors } from "../controllers/colorController.js";
import {
  getSplitComplementaryColors,
  getTriadicColors,
  getMonochromaticColors,
  getTetradicColors,
  getAnalogousColors,
  getComplementaryColors,
} from "../utils/tinyColors.js";

const router = express.Router();

router.post("/complementary", getComplementaryColors);

router.get("/complementary/:hex", (req, res) => {
  const { hex } = req.params;
  const colors = getComplementaryColors(hex);
  res.json(colors);
});

router.get("/split-complementary/:hex", (req, res) => {
  const { hex } = req.params;
  const colors = getSplitComplementaryColors(hex);
  res.json({
    original: hex,
    colors: [
      {
        complementary: colors,
      },
    ],
  });
});

router.get("/triadic/:hex", (req, res) => {
  const { hex } = req.params;
  const colors = getTriadicColors(hex);
  res.json({
    original: hex,
    colors: [
      {
        getTriadicColors: colors,
      },
    ],
  });
});

router.get("/tetradic/:hex", (req, res) => {
  const { hex } = req.params;
  const colors = getTetradicColors(hex);
  res.json({
    original: hex,
    colors: [
      {
        getTetradicColors: colors,
      },
    ],
  });
});

router.get("/monochromatic/:hex", (req, res) => {
  const { hex } = req.params;
  const colors = getMonochromaticColors(hex);
  res.json({
    original: hex,
    colors: [
      {
        getMonochromaticColors: colors,
      },
    ],
  });
});

router.get("/analogous/:hex", (req, res) => {
  const { hex } = req.params;
  const colors = getAnalogousColors(hex);
  res.json({
    original: hex,
    colors: [
      {
        getAnalogousColors: colors,
      },
    ],
  });
});

export default router;
