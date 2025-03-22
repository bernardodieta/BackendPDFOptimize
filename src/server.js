import express from "express";
import multer from "multer";
import pdfRoutes from "./routes/pdfRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";
import imageIa from "./routes/imageIA.js";
import cors from "cors";
import bodyParser from "body-parser";

const server = express();
const upload = multer({ dest: "uploads/" });

// Configurar CORS
server.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));

// Parsear JSON y URL-encoded para otras rutas
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Configurar rutas
server.use("/color", colorRoutes);
server.use("/optimize", upload.single("pdffile"), pdfRoutes); // Asegúrate de que "pdffile" sea el nombre correcto del campo

server.use("/image", imageIa);

// Iniciar el servidor
server.listen(8080, () => {
  console.log("Server running on port 8080");
});
