import { Response } from "express";
import { RequestAgregamento } from "../types";
import normalizarDados from "../functions/normalizarDados";
import aglomerativo from "../functions/aglomerativo";

function route_aglomerativo(req: RequestAgregamento, res: Response) {
    const data = req.excelData;
    const clusters = req.clusters;

    if (!data || !clusters) throw new Error("Excel data ou Clusters não foi encontrado");

    normalizarDados(data);

    const aglomerative = aglomerativo(clusters, data);

    const indexes = aglomerative.map((g) => g.items);

    res.send(indexes);
}

export default route_aglomerativo;
