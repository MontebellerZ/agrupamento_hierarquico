import { ExcelData, Point } from "../types";
import distanciaEuclidiana from "./distanciaEuclidiana";

export function dissimilaridade(data: ExcelData[]): number[][] {
    const size = data.length;

    const matrix: number[][] = [];

    for (let i = 0; i < size; i++) {
        matrix.push([]);

        for (let j = 0; j <= i; j++) {
            matrix[i].push(i === j ? 0 : distanciaEuclidiana(data[i], data[j]));
        }
    }

    return matrix;
}

export function addDissimilaridade(
    oldDissimilarity: number[][],
    data: ExcelData[],
    newDataIndex: number = data.length - 1
): number[][] {
    if (data.length !== oldDissimilarity.length + 1) {
        throw new Error(
            "Excel data length should be exactly 1 higher than the old dissimilarity length"
        );
    }

    const newDistances: number[] = data.map((d1, i) =>
        i === newDataIndex ? 0 : distanciaEuclidiana(d1, data[newDataIndex])
    );

    oldDissimilarity.splice(newDataIndex, 0, newDistances.slice(0, newDataIndex + 1));

    for (let i = newDataIndex + 1; i < newDistances.length; i++) {
        oldDissimilarity[i].splice(newDataIndex, 0, newDistances[i]);
    }

    return oldDissimilarity;
}

export function removeDissimilaridade(oldDissimilarity: number[][], removeDataIndex: number) {
    oldDissimilarity.splice(removeDataIndex, 1);

    for (let i = removeDataIndex; i < oldDissimilarity.length; i++) {
        oldDissimilarity[i].splice(removeDataIndex, 1);
    }
}

export function joinMaxDissimilaridade(dissimilarity: number[][], point: Point) {
    const oldPoints: { a: Point[]; b: Point[] } = { a: [], b: [] };

    oldPoints.a.push(
        ...dissimilarity[point.i].map((value, k): Point => ({ i: point.i, j: k, value }))
    );

    oldPoints.b.push(
        ...dissimilarity[point.j].map((value, k): Point => ({ i: point.j, j: k, value }))
    );

    for (let k = point.i + 1; k < dissimilarity.length; k++) {
        oldPoints.a.push({ i: k, j: point.i, value: dissimilarity[k][point.i] });
    }

    for (let k = point.j + 1; k < dissimilarity.length; k++) {
        oldPoints.b.push({ i: k, j: point.j, value: dissimilarity[k][point.j] });
    }

    if (oldPoints.a.length !== oldPoints.b.length) {
        throw new Error("Old points arrays should not have different lengths");
    }

    for (let k = 0; k < dissimilarity.length; k++) {
        let coords1 = [k, point.i];
        let coords2 = [k, point.j];
    }
}
