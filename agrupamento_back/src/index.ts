import express from "express";
import multer from "multer";
import readExcel from "./functions/readExcel";
import { ExcelData } from "./types";
import divisivo from "./functions/divisivo";

const upload = multer({ dest: "./public/" });

const app = express();

app.post("/divisivo", upload.single("excel"), (req, res) => {
    const excel = req.file;
    const clusters = Number(req.body.clusters);

    if (!excel) return res.status(400).send("Nenhum arquivo foi enviado.");
    if (!clusters || isNaN(clusters))
        return res.status(400).send("Quantidade de Clusters precisa ser um número maior que 0.");

    const data: ExcelData[] = readExcel(excel.path);

    if (clusters > data.length) {
        return res
            .status(400)
            .send(
                `Quantidade de Clusters deve ser <= ao total de items no excel (${data.length}).`
            );
    }

    const divisive = divisivo(clusters, data);

    res.send(divisive);
});

app.listen(3001, () => {
    console.log("Listening on port 3001");
});
