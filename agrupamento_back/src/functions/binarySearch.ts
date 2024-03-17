import { DissimilarityPoint } from "../types";

export function binarySearch(search: number, sorted: DissimilarityPoint[]) {
    let min = 0;
    let max = sorted.length;

    while (min < max) {
        const mid = (min + max) >>> 1;
        // or (same result)
        // const mid = Math.floor((min + max) / 2);

        if (sorted[mid].value < search) min = mid + 1;
        else max = mid;
    }

    return min;
}

export function insertInSorted(obj: DissimilarityPoint, sorted: DissimilarityPoint[]) {
    const insertPos = binarySearch(obj.value, sorted);
    sorted.splice(insertPos, 0, obj);
    return sorted;
}
