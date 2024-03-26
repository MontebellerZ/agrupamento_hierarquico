import { ExcelData, Group, Point } from "../types";
import { dissimilaridade } from "./dissimilaridade";
import centroid from "./centroid";
import sortByDistance from "./sortByDistance";

function getMostSimilarsGroups(groups: Group[], distances: Point[]): Group[] {
    for (let k = 0; k < distances.length; k++) {
        const d1 = distances[k].i;
        const d2 = distances[k].j;

        if (d1 === d2) continue;

        const g1 = groups.find((g) => g.items.includes(d1));
        const g2 = groups.find((g) => g.items.includes(d2));

        if (g1 === g2) continue;

        return [g1!, g2!];
    }

    throw new Error("Should find at least one similar group.");
}

function generateNewGroup(groups: Group[], data: ExcelData[]): Group {
    const newItems = groups.flatMap(({ items }) => items);

    return { items: newItems };
}

function aglomerativo_single(clusters: number, data: ExcelData[]): Group[] {
    const groups: Group[] = data.map((_, id) => ({
        items: [id],
        centroid: centroid([id], data),
    }));

    const dissimilarity = dissimilaridade(data);
    const distances = sortByDistance(dissimilarity);

    while (groups.length > clusters) {
        const similarGroups = getMostSimilarsGroups(groups, distances);

        const joinedGroup = generateNewGroup(similarGroups, data);

        similarGroups.forEach((g1) => {
            const groupId = groups.findIndex((g2) => g1 === g2);
            if (groupId < 0) throw new Error("The group should exist in the array");
            groups.splice(groupId, 1);
        });

        groups.push(joinedGroup);
    }

    return groups;
}

export default aglomerativo_single;
