import { NextFunction, Response } from "express";
import { AglomerativeResults, Group, RequestAgregamento } from "../types";
import normalizarDados from "../functions/normalizarDados";
import aglomerativo_centroid from "../functions/aglomerativo_centroid";
import aglomerativo_single from "../functions/aglomerativo_single";
import aglomerativo_complete from "../functions/aglomerativo_complete";

const AVAILABLE_TYPES = [
    { key: "singleLinkage", func: aglomerativo_single },
    { key: "completeLinkage", func: aglomerativo_complete },
    { key: "centroidLinkage", func: aglomerativo_centroid },
];

function route_aglomerativo(req: RequestAgregamento, res: Response, next: NextFunction) {
    try {
        const type = req.params.type;

        if (type && !AVAILABLE_TYPES.some(({ key }) => key === type)) {
            const types = AVAILABLE_TYPES.map((t) => `"${t.key}"`).join(", ");
            throw new Error("Type must be not defined or equal to either: " + types);
        }

        const data = req.excelData;
        const clusters = req.clusters;

        if (!data || !clusters) throw new Error("Excel data or clusters not set");

        normalizarDados(data);

        const results: AglomerativeResults = {};

        AVAILABLE_TYPES.forEach(({ key, func }) => {
            if (!type || type === key) results[key] = func(clusters, data);
        });

        const indexes: { [type: string]: number[][] } = {};

        for (const key in results) {
            indexes[key] = results[key].map((g) => g.items);
        }

        res.send(indexes);
    } catch (err) {
        next(err);
    }
}

export default route_aglomerativo;
