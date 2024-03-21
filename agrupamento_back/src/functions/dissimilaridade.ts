import { ExcelData } from "../types";
import distanciaEuclidiana from "./distanciaEuclidiana";

function dissimilaridade(data: ExcelData[]) {
    const size = data.length;

    const matrix: number[][] = [];

    for (let i = 0; i < size; i++) {
        matrix.push([]);

        const d1 = data[i];

        for (let j = 0; j <= i; j++) {
            if (i === j) {
                matrix[i].push(0);
                continue;
            }

            const d2 = data[j];

            const distance = distanciaEuclidiana(d1, d2);

            matrix[i].push(distance);
        }
    }

    return matrix;
}

export default dissimilaridade;
