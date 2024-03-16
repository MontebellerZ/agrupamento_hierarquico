import express from "express";
import multer from "multer";
import readExcel from "./functions/readExcel";
import dissimilaridade from "./functions/dissimilaridade";
import { Data } from "./types";

const upload = multer({ dest: "./public/" });

const app = express();

app.post("/data", upload.single("excel"), (req, res) => {
    const excel = req.file;

    if (!excel) return res.status(400).send("Nenhum arquivo foi enviado.");

    const data: Data[] = readExcel(excel.path) as Data[];

    const dissimilarity = dissimilaridade(data);

    res.send(dissimilarity);
});

app.listen(3001, () => {
    console.log("Listening on port 3001");
});
