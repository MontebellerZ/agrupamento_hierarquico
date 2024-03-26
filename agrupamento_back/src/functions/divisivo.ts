import { Point, ExcelData, Group, RelatedGroups } from "../types";
import { insertSortedNumber } from "./binarySearch";
import centroid from "./centroid";
import { dissimilaridade } from "./dissimilaridade";
import sortByDistance from "./sortByDistance";
import sse from "./sse";

function furthestPoints(group: number[], distances: Point[]): Point {
    if (group.length === 0) throw new Error("Empty groups should not exist");

    // distances must be sorted in ascending order of value for this to work correctly
    for (let k = distances.length - 1; k >= 0; k--) {
        if (group.includes(distances[k].i) && group.includes(distances[k].j)) {
            return distances[k];
        }
    }

    throw new Error("Max should not be undefined");
}

function getLeastSimilarGroup(groups: Group[]): Group {
    let leastSimilar: Group | null = null;

    if (groups.length <= 0) throw new Error("Should have at least one group");

    for (let i = 0; i < groups.length; i++) {
        if (!leastSimilar || leastSimilar.sse! < groups[i].sse!) leastSimilar = groups[i];
    }

    if (!leastSimilar) throw new Error("leastSimilar should find one group");

    return leastSimilar;
}

function getRelatedItems(group: Group, dissimilarity: number[][]): RelatedGroups {
    const itemA = group.furthests!.i;
    const itemB = group.furthests!.j;

    const lineA = dissimilarity[itemA].map((value, j): Point => ({ i: itemA, j, value: value }));
    const lineB = dissimilarity[itemB].map((value, j): Point => ({ i: itemB, j, value: value }));

    const columnA = dissimilarity
        .slice(itemA)
        .map((d, i): Point => ({ i: itemA, j: i + itemA, value: d[itemA] }));
    const columnB = dissimilarity
        .slice(itemB)
        .map((d, i): Point => ({ i: itemB, j: i + itemB, value: d[itemB] }));

    const relatedA: Point[] = lineA
        .concat(columnA)
        .filter((r) => r.j !== itemB && r.j !== r.i && group.items.includes(r.j));
    const relatedB: Point[] = lineB
        .concat(columnB)
        .filter((r) => r.j !== itemA && r.j !== r.i && group.items.includes(r.j));

    return { a: relatedA, b: relatedB };
}

function generateNewGroups(
    group: Group,
    related: RelatedGroups,
    furthests: Point,
    data: ExcelData[],
    distances: Point[]
): Group[] {
    const leftItems = group.items.filter(
        (n) => n !== group.furthests!.i && n !== group.furthests!.j
    );

    if (leftItems.length !== related.b.length || leftItems.length !== related.a.length) {
        throw new Error("Related arrays should have the leftItems length");
    }

    const newItems = {
        a: new Array<number>(),
        b: new Array<number>(),
    };

    for (let i = 0; i < leftItems.length; i++) {
        const groupId = leftItems[i];
        const valueA = related.a[i];
        const valueB = related.b[i];

        if (groupId !== valueA.j || groupId !== valueB.j) {
            throw new Error("groupId should be equal to the j attributes of the items");
        }

        valueA.value < valueB.value ? newItems.a.push(groupId) : newItems.b.push(groupId);
    }

    insertSortedNumber(furthests.i, newItems.a);
    insertSortedNumber(furthests.j, newItems.b);

    const newCentroids = {
        a: centroid(newItems.a, data),
        b: centroid(newItems.b, data),
    };
    const newSSE = {
        a: sse(newItems.a, newCentroids.a, data),
        b: sse(newItems.b, newCentroids.b, data),
    };
    const newFurthests = {
        a: furthestPoints(newItems.a, distances),
        b: furthestPoints(newItems.b, distances),
    };

    return [
        { items: newItems.a, centroid: newCentroids.a, sse: newSSE.a, furthests: newFurthests.a },
        { items: newItems.b, centroid: newCentroids.b, sse: newSSE.b, furthests: newFurthests.b },
    ];
}

function divisivo(clusters: number, data: ExcelData[]): Group[] {
    const dissimilarity = dissimilaridade(data);
    const distances = sortByDistance(dissimilarity);

    const initialItems = data.map((_, id) => id);
    const initialCentroid = centroid(initialItems, data);
    const initialSSE = sse(initialItems, initialCentroid, data);
    const initialFurthest = furthestPoints(initialItems, distances);

    const groups: Group[] = [
        {
            items: initialItems,
            centroid: initialCentroid,
            sse: initialSSE,
            furthests: initialFurthest,
        },
    ];

    while (groups.length < clusters) {
        const group = getLeastSimilarGroup(groups);

        const related = getRelatedItems(group, dissimilarity);

        const newGroups = generateNewGroups(group, related, group.furthests!, data, distances);

        const groupIndex = groups.findIndex((g) => g === group);

        groups.splice(groupIndex, 1, ...newGroups);
    }

    return groups;
}

export default divisivo;
