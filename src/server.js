import 'dotenv/config';
import express from "express";
import multer from "multer";
import pdfRoutes from "./routes/pdfRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";

const PORT = process.env.PORT ?? 8080;

// CORS_ORIGIN acepta un origen unico o una lista separada por comas.
// En desarrollo: http://localhost:4321
// En Docker: el proxy de nginx hace las requests server-to-server, no hay origen externo.
// Si la variable no esta definida se permite cualquier origen (util en dev rapido).
const rawOrigins = process.env.CORS_ORIGIN;
const corsOrigin = rawOrigins
  ? rawOrigins.split(',').map(o => o.trim())
  : true; // true = cualquier origen

const server = express();
const upload = multer({ dest: "uploads/" });

server.use(cors({
  origin: corsOrigin,
  optionsSuccessStatus: 200
}));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/color", colorRoutes);
server.use("/optimize", upload.single("pdffile"), pdfRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
