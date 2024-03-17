import { DissimilarityPoint, ExcelData } from "../types";
import { insertInSorted } from "./binarySearch";
import dissimilaridade from "./dissimilaridade";

function sortByDistance(dissimilarity: number[][]): DissimilarityPoint[] {
    if (!Array.isArray(dissimilarity)) throw new Error("Dissimilarity must be a valid array");

    let sorted: DissimilarityPoint[] = [];

    dissimilarity.forEach((line, i) => {
        line.forEach((value, j) => {
            insertInSorted({ value, i, j }, sorted);
        });
    });

    return sorted;
}

function divisivo(data: ExcelData[]) {
    const dissimilarity = dissimilaridade(data);

    const sortedDissimilarity = sortByDistance(dissimilarity);

    return sortedDissimilarity;
}

export default divisivo;
