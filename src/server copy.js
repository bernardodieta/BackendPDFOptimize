import express from "express";
import multer from "multer";
import pkg from "pdf-lib";
const { PDFDocument, PDFName, PDFObjectType, PDFRawStream } = pkg;
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { randomInt } from "crypto";
import { exec } from "child_process";
import { optimizePdfWithGhostscript } from "./utils/utils.js";

const server = express();
const upload = multer({ dest: "uploads/" });
const ghostscriptPath = '"C:\\Program Files\\gs\\gs10.03.1\\bin\\gswin64c.exe"';


server.post("/optimize", upload.single("pdf"), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    console.log(pdfPath);

    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath)).catch(
      (error) => {
        console.log(error);
      }
    );

    if (!pdfDoc) {
      return res.status(500).send("Error al cargar el archivo PDF");
    }

    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { xObject } = page.node;
      if (xObject) {
        for (const key of Object.keys(xObject)) {
          const obj = xObject[key];
          if (obj.lookup) {
            const image = obj.lookup(
              PDFName.of("XObject"),
              PDFObjectType.Dictionary
            );
            if (
              image &&
              image.lookup(PDFName.of("Subtype")) === PDFName.of("Image")
            ) {
              const buffer =
                image.lookup(PDFName.of("Filter")) === PDFName.of("DCTDecode")
                  ? image.lookup(PDFName.of("Contents")).decode()
                  : null;
              if (buffer) {
                const optimizedBuffer = await sharp(buffer)
                  .jpeg({ quality: 50 })
                  .png({ quality: 50 })
                  .toBuffer();
                image.set(
                  PDFName.of("Contents"),
                  PDFRawStream.of(optimizedBuffer)
                );
              }
            }
          }
        }
      }
    }

    const tempOptimizedPdfPath = path.join(
      "uploads/temp/",
      "temp-optimized-" + randomInt(500) + req.file.originalname
    );
    const optimizedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(tempOptimizedPdfPath, optimizedPdfBytes);

    const finalOutputPath = path.join(
      "uploads/temp/",
      "final-optimized-" + randomInt(500) + req.file.originalname
    );
    await optimizePdfWithGhostscript(tempOptimizedPdfPath, finalOutputPath);

    res.download(finalOutputPath, "optimized-" + req.file.originalname);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al procesar el archivo");
  }
});

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
