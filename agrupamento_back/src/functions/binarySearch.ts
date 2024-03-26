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

export function insertSortedPoint(obj: Point, sorted: Point[]) {
    if (sorted.length <= 0 || obj.value >= sorted[sorted.length - 1].value) {
        sorted.push(obj);
        return sorted;
    }

    if (obj.value <= sorted[0].value) {
        sorted.unshift(obj);
        return sorted;
    }

    const insertPos = binarySearch(
        obj.value,
        sorted.map(({ value }) => value)
    );
    sorted.splice(insertPos, 0, obj);
    return sorted;
}

export function insertSortedNumber(n: number, sorted: number[]) {
    const insertPos = binarySearch(n, sorted);
    sorted.splice(insertPos, 0, n);
    return sorted;
}
