import { Point } from "../types";

export function binarySearch(search: number, sorted: number[]) {
    let min = 0;
    let max = sorted.length;

    while (min < max) {
        const mid = (min + max) >>> 1;
        // or (same result)
        // const mid = Math.floor((min + max) / 2);

        if (sorted[mid] < search) min = mid + 1;
        else max = mid;
    }

    return min;
}

export function insertSortedNumber(n: number, sorted: number[]) {
    const insertPos = binarySearch(n, sorted);
    sorted.splice(insertPos, 0, n);
    return sorted;
}
