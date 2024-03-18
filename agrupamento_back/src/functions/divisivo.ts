import { DissimilarityPoint, ExcelData, LeastSimilarGroup, RelatedGroups } from "../types";
import { insertDissimilarity, insertNumber } from "./binarySearch";
import dissimilaridade from "./dissimilaridade";

function sortByDistance(dissimilarity: number[][]): DissimilarityPoint[] {
    if (!Array.isArray(dissimilarity)) throw new Error("Dissimilarity must be a valid array");

    let sorted: DissimilarityPoint[] = [];

    dissimilarity.forEach((line, i) => {
        line.forEach((value, j) => {
            insertDissimilarity({ value, i, j }, sorted);
        });
    });

    // reverse() is needed to sort the array in a descending order of value
    return sorted.reverse();
}

function getLeastSimilarPoints(group: number[], distances: DissimilarityPoint[]) {
    if (group.length === 0) throw new Error("Empty groups should not exist");

    // distances must already be sorted in descending order of value for find to work correctly
    const max = distances.find((d) => group.includes(d.i) && group.includes(d.j));

    if (!max) throw new Error("Max should not be undefined");

    return max;
}

function getLeastSimilarGroup(
    groups: number[][],
    distances: DissimilarityPoint[]
): LeastSimilarGroup {
    let leastSimilar: LeastSimilarGroup | null = null;

    if (groups.length <= 0) throw new Error("Should have at least one group");

    for (let i = 0; i < groups.length; i++) {
        const furthestPoint = getLeastSimilarPoints(groups[i], distances);

        if (leastSimilar && leastSimilar.furthestPoint.value >= furthestPoint.value) continue;

        leastSimilar = { items: groups[i], groupIndex: i, furthestPoint };
    }

    if (!leastSimilar) throw new Error("leastSimilar should find one group");

    return leastSimilar;
}

function getRelatedItems(group: LeastSimilarGroup, dissimilarity: number[][]): RelatedGroups {
    const itemA = group.furthestPoint.i;
    const itemB = group.furthestPoint.j;

    const lineA = dissimilarity[itemA].map(
        (value, j): DissimilarityPoint => ({ i: itemA, j, value: value })
    );
    const lineB = dissimilarity[itemB].map(
        (value, j): DissimilarityPoint => ({ i: itemB, j, value: value })
    );

    const columnA = dissimilarity
        .slice(itemA)
        .map((d, i): DissimilarityPoint => ({ i: itemA, j: i + itemA, value: d[itemA] }));
    const columnB = dissimilarity
        .slice(itemB)
        .map((d, i): DissimilarityPoint => ({ i: itemB, j: i + itemB, value: d[itemB] }));

    const relatedA: DissimilarityPoint[] = lineA
        .concat(columnA)
        .filter((r) => r.j !== itemB && r.j !== r.i && group.items.includes(r.j));
    const relatedB: DissimilarityPoint[] = lineB
        .concat(columnB)
        .filter((r) => r.j !== itemA && r.j !== r.i && group.items.includes(r.j));

    return { a: relatedA, b: relatedB };
}

function generateNewGroups(
    items: number[],
    related: RelatedGroups,
    furthestPoint: DissimilarityPoint
) {
    const newGroups: { a: number[]; b: number[] } = { a: [], b: [] };

    for (let i = 0; i < items.length; i++) {
        const groupId = items[i];
        const valueA = related.a[i];
        const valueB = related.b[i];

        if (groupId !== valueA.j || groupId !== valueB.j) {
            throw new Error("groupId should be equal to the j attributes of the items");
        }

        valueA.value < valueB.value ? newGroups.a.push(groupId) : newGroups.b.push(groupId);
    }

    insertNumber(furthestPoint.i, newGroups.a);
    insertNumber(furthestPoint.j, newGroups.b);

    return newGroups;
}

function divisivo(clusters: number, data: ExcelData[]) {
    const groups = [data.map((_, id) => id)];

    const dissimilarity = dissimilaridade(data);

    const sorted = sortByDistance(dissimilarity);

    while (groups.length < clusters) {
        const group = getLeastSimilarGroup(groups, sorted);

        const related = getRelatedItems(group, dissimilarity);

        if (groups.length === 2) console.log(group, related);

        const leftItems = group.items.filter(
            (n) => n !== group.furthestPoint.i && n !== group.furthestPoint.j
        );

        if (leftItems.length !== related.b.length || leftItems.length !== related.a.length) {
            throw new Error("Related arrays should have the leftItems length");
        }

        const newGroups = generateNewGroups(leftItems, related, group.furthestPoint);

        groups.splice(group.groupIndex, 1, newGroups.a, newGroups.b);
    }

    return groups;
}

export default divisivo;
