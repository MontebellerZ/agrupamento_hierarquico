import { ExcelData, Group, Point } from "../types";
import { dissimilaridade } from "./dissimilaridade";
import centroid from "./centroid";

function getMinPoint(dissimilarity: number[][]): Point {
    let min: Point | undefined = undefined;

    for (let i = 0; i < dissimilarity.length; i++) {
        for (let j = 0; j < dissimilarity[i].length; j++) {
            if (i === j || (min && min.value <= dissimilarity[i][j])) continue;

            min = { i, j, value: dissimilarity[i][j] };
        }
    }

    if (!min) throw new Error("Should find at least one similar group.");

    return min;
}

function generateNewGroup(groups: Group[], data: ExcelData[]): Group {
    const newItems = groups.flatMap(({ items }) => items);

    return { items: newItems };
}

function aglomerativo_complete(clusters: number, data: ExcelData[]): Group[] {
    const groups: Group[] = data.map((_, id) => ({
        items: [id],
        centroid: centroid([id], data),
    }));

    const dissimilarity = dissimilaridade(data);

    while (groups.length > clusters) {
        const minPoint = getMinPoint(dissimilarity);

        const similarGroups = [groups[minPoint.i], groups[minPoint.j]];

        const joinedGroup = generateNewGroup(similarGroups, data);

        groups.splice(Math.max(minPoint.i, minPoint.j), 1);
        groups.splice(Math.min(minPoint.i, minPoint.j), 1);
        groups.push(joinedGroup);
    }

    return groups;
}

export default aglomerativo_complete;
