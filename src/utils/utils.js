import { exec } from "child_process";

const ghostscriptPath = '"C:\\Program Files\\gs\\gs10.05.1\\bin\\gswin64c.exe"';

export const optimizePdfWithGhostscript = (inputPath, outputPath, quality) => {
  console.log("Quality recibido:", quality, "Tipo:", typeof quality);
  
  let dPDFSETTINGS = "screen"; // Valor por defecto
  if (quality && quality === "low") {
    dPDFSETTINGS = "screen";
  } else if (quality && quality === "medium") {
    dPDFSETTINGS = "ebook";
  } else if (quality && quality === "high") { // Corregido: "hight" -> "high"
    dPDFSETTINGS = "printer";
  }

  return new Promise((resolve, reject) => {
    const command = `${ghostscriptPath} -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/${dPDFSETTINGS} -dNOPAUSE -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;
    console.log("Comando corrido", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(outputPath);
      }
    });
  });
};
