import { Data } from "../types";

function distanciaEuclidiana(d1: Data, d2: Data): number {
    const _d1 = Object.keys(d1).filter((key) => typeof d1[key] === "number");
    const _d2 = Object.keys(d2).filter((key) => typeof d2[key] === "number");

    if (!_d1.length || !_d2.length || _d1.length !== _d2.length)
        throw new Error("Não devem haver células vazias.");

    const totalSum = _d1.reduce((sum, key) => {
        const v1 = d1[key] as number;
        const v2 = d2[key] as number;

        return sum + Math.pow(v1 - v2, 2);
    }, 0);

    const result = Math.sqrt(totalSum);

    return result;
}

function dissimilaridade(data: Data[]) {
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
