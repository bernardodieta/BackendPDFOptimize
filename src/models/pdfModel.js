import pkg from 'pdf-lib';
const { PDFDocument, PDFName, PDFObjectType, PDFRawStream } = pkg;
import sharp from "sharp";
import fs from "fs";

export const processPdf = async (pdfPath) => {
  try {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));

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

    const optimizedPdf = await pdfDoc.save();
    return { optimizedPdf, error: null };
  } catch (error) {
    console.log(error);
    return { optimizedPdf: null, error };
  }
};
