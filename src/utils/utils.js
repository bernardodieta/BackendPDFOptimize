import { exec } from "child_process";

const ghostscriptPath = '"C:\\Program Files\\gs\\gs10.03.1\\bin\\gswin64c.exe"';

export const optimizePdfWithGhostscript = (inputPath, outputPath, quality) => {
  let dPDFSETTINGS = "";
  if (quality && quality === "low") {
    dPDFSETTINGS = "screen";
  } else if (quality && quality === "medium") {
    dPDFSETTINGS = "ebook";
  } else if (quality && quality === "hight") {
    dPDFSETTINGS = "print";
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
