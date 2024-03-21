import { ExcelData } from "../types";
import distanciaEuclidiana from "./distanciaEuclidiana";

function sse(items: number[], centroid: ExcelData, data: ExcelData[]): number {
    return data
        .filter((_, id) => items.includes(id))
        .reduce((sum, d) => sum + distanciaEuclidiana(centroid, d), 0);
}

export default sse;
