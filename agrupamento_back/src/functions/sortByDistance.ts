import { Point } from "../types";
import { insertDissimilarity } from "./binarySearch";

function sortByDistance(dissimilarity: number[][]): Point[] {
    if (!Array.isArray(dissimilarity)) throw new Error("Dissimilarity must be a valid array");

    let sorted: Point[] = [];

    dissimilarity.forEach((line, i) => {
        line.forEach((value, j) => {
            insertDissimilarity({ value, i, j }, sorted);
        });
    });

    // reverse() is needed to sort the array in a descending order of value
    return sorted.reverse();
}

export default sortByDistance;
