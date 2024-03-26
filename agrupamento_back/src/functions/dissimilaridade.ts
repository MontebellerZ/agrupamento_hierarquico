import { ExcelData } from "../types";
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
