import { processPdf } from "../models/pdfModel.js";
import path from "path";
import fs from "fs";
import { randomInt } from "crypto";
import { optimizePdfWithGhostscript } from "../utils/utils.js";

// Función para limpiar archivos temporales
const cleanupFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
      } catch (error) {
        console.error(`Error al eliminar archivo ${filePath}:`, error.message);
      }
    }
  });
};

export const optimizePdf = async (req, res) => {
  // Obtener quality de múltiples fuentes posibles
  const quality = req.body.quality || req.query.quality || "low";
  console.log("Quality obtenido:", quality, "De:", {
    body: req.body.quality,
    query: req.query.quality,
    usado: quality
  });
  console.log("Headers:", req.headers);
  console.log("Body completo:", req.body);
  console.log("Query completo:", req.query);
  
  let tempOptimizedPdfPath, finalOutputPath;
  
  try {
    const pdfPath = req.file.path;
    const { optimizedPdf, error } = await processPdf(pdfPath);

    if (error) {
      // Limpiar archivo original en caso de error
      cleanupFiles([pdfPath]);
      return res.status(500).send("Error al cargar el archivo PDF");
    }

    tempOptimizedPdfPath = path.join(
      "uploads/temp/",
      "temp-optimized-" + randomInt(500) + req.file.originalname
    );
    fs.writeFileSync(tempOptimizedPdfPath, optimizedPdf);

    finalOutputPath = path.join(
      "uploads/temp/",
      "final-optimized-" + randomInt(500) + req.file.originalname
    );
    
    await optimizePdfWithGhostscript(
      tempOptimizedPdfPath,
      finalOutputPath,
      quality
    );

    // Enviar el archivo al frontend y limpiar después
    res.download(finalOutputPath, "optimized-" + req.file.originalname, (err) => {
      // Limpiar archivos temporales después de enviar
      cleanupFiles([
        pdfPath,                // Archivo original subido
        tempOptimizedPdfPath,   // Archivo temporal procesado
        finalOutputPath         // Archivo final optimizado
      ]);

      if (err) {
        console.error("Error al enviar el archivo:", err);
      } else {
        console.log("Archivo enviado y archivos temporales eliminados");
      }
    });
  } catch (err) {
    console.log(err);
    
    // Limpiar archivos en caso de error también
    cleanupFiles([
      req.file?.path,
      tempOptimizedPdfPath,
      finalOutputPath
    ]);
    
    res.status(500).send("Error al procesar el archivo");
  }
};
