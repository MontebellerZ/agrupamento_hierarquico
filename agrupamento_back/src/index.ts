import express from "express";
import multer from "multer";
import readExcel from "./functions/readExcel";
import { ExcelData } from "./types";
import divisivo from "./functions/divisivo";

const upload = multer({ dest: "./public/" });

const app = express();

app.post("/data", upload.single("excel"), (req, res) => {
    const excel = req.file;

    if (!excel) return res.status(400).send("Nenhum arquivo foi enviado.");

    const data: ExcelData[] = readExcel(excel.path) as ExcelData[];

    const divisive = divisivo(data);

    res.send(divisive);
});

app.listen(3001, () => {
    console.log("Listening on port 3001");
});
