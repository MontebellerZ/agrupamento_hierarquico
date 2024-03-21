import { ExcelData } from "../types";

function distanciaEuclidiana(d1: ExcelData, d2: ExcelData): number {
    const _d1 = Object.keys(d1).filter((key) => typeof d1[key] === "number");
    const _d2 = Object.keys(d2).filter((key) => typeof d2[key] === "number");

    if (!_d1.length || !_d2.length || _d1.length !== _d2.length)
        throw new Error("Não devem haver células vazias.");

    const totalSum = _d1.reduce((sum, key) => {
        const v1 = d1[key] as number;
        const v2 = d2[key] as number;

        return sum + Math.pow(v1 - v2, 2);
    }, 0);

    return totalSum;
}

export default distanciaEuclidiana;
