import { NextFunction, Response } from "express";
import { RequestAgregamento } from "../types";
import divisivo from "../functions/divisivo";
import normalizarDados from "../functions/normalizarDados";

function route_divisivo(req: RequestAgregamento, res: Response, next: NextFunction) {
    try {
        const data = req.excelData;
        const clusters = req.clusters;

        if (!data || !clusters) throw new Error("Excel data ou Clusters não foi encontrado");

        normalizarDados(data);

        const divisive = divisivo(clusters, data);

        const indexes = divisive.map((g) => g.items);

        res.send(indexes);
    } catch (err) {
        next(err);
    }
}

export default route_divisivo;
