import { Point } from "../types";

function sortByDistance(dissimilarity: number[][]): Point[] {
    if (!Array.isArray(dissimilarity)) throw new Error("Dissimilarity must be a valid array");

    const sorted: Point[] = dissimilarity
        .flatMap((a, i): Point[] => a.map((v, j): Point => ({ value: v, i, j })))
        .sort((a, b) => a.value - b.value);

    return sorted;
}

export default sortByDistance;
