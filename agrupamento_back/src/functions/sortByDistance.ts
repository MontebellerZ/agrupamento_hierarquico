import { Point } from "../types";
import { insertSortedPoint } from "./binarySearch";

function sortByDistance(dissimilarity: number[][]): Point[] {
    if (!Array.isArray(dissimilarity)) throw new Error("Dissimilarity must be a valid array");

    let sorted: Point[] = [];

    dissimilarity.forEach((line, i) => {
        line.forEach((value, j) => {
            insertSortedPoint({ value, i, j }, sorted);
        });
    });

    return sorted;
}

export default sortByDistance;
