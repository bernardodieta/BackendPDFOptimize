import { processPdf } from "../models/pdfModel.js";
import path from "path";
import fs from "fs";
import { randomInt } from "crypto";
import { optimizePdfWithGhostscript } from "../utils/utils.js";

export const optimizePdf = async (req, res) => {
  const { quality } = req.body;
  console.log(quality);
  
  try {
    const pdfPath = req.file.path;
    const { optimizedPdf, error } = await processPdf(pdfPath);

    if (error) {
      return res.status(500).send("Error al cargar el archivo PDF");
    }

    const tempOptimizedPdfPath = path.join(
      "uploads/temp/",
      "temp-optimized-" + randomInt(500) + req.file.originalname
    );
    fs.writeFileSync(tempOptimizedPdfPath, optimizedPdf);

    const finalOutputPath = path.join(
      "uploads/temp/",
      "final-optimized-" + randomInt(500) + req.file.originalname
    );
    await optimizePdfWithGhostscript(
      tempOptimizedPdfPath,
      finalOutputPath,
      quality
    );

    res.download(finalOutputPath, "optimized-" + req.file.originalname);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al procesar el archivo");
  }
};
