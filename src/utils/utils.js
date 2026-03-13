import { exec } from "child_process";
import os from "os";

// En Linux (Docker) Ghostscript se instala como `gs`. En Windows se usa la ruta del instalador.
const isWindows = os.platform() === "win32";
const ghostscriptPath = isWindows
  ? '"C:\\Program Files\\gs\\gs10.05.1\\bin\\gswin64c.exe"'
  : "gs";

const QUALITY_MAP = {
  low: "screen",
  medium: "ebook",
  high: "printer",
};

export const optimizePdfWithGhostscript = (inputPath, outputPath, quality) => {
  const setting = QUALITY_MAP[quality] ?? "screen";

  return new Promise((resolve, reject) => {
    const command = `${ghostscriptPath} -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/${setting} -dNOPAUSE -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;
    console.log("Ghostscript command:", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(outputPath);
      }
    });
  });
};
