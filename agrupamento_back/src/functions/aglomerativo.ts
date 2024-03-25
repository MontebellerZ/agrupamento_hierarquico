import { ExcelData, Group, Point } from "../types";
import dissimilaridade from "./dissimilaridade";
import centroid from "./centroid";
import sortByDistance from "./sortByDistance";

function getMostSimilarsGroups(groups: Group[], distances: Point[]): Group[] {
    for (let k = distances.length - 1; k >= 0; k--) {
        if (distances[k].i === distances[k].j) continue;

        return [groups[distances[k].i], groups[distances[k].j]];
    }

    throw new Error("Should find at least one similar group.");
}

function generateNewGroup(groups: Group[], data: ExcelData[]): Group {
    const newItems = groups.flatMap(({ items }) => items);
    const newCentroid = centroid(newItems, data);

    return { items: newItems, centroid: newCentroid };
}

function aglomerativo(clusters: number, data: ExcelData[]): Group[] {
    const groups: Group[] = data.map((_, id) => {
        const groupItems = [id];
        const groupCentroid = centroid(groupItems, data);

        return { items: groupItems, centroid: groupCentroid };
    });

    while (groups.length > clusters) {
        const dissimilarity = dissimilaridade(groups.map((g) => g.centroid));
        const distances = sortByDistance(dissimilarity);

        const similarGroups = getMostSimilarsGroups(groups, distances);

        const joinedGroup = generateNewGroup(similarGroups, data);

        similarGroups.forEach((g1) => {
            const groupId = groups.findIndex((g2) => g1 === g2);
            if (groupId < 0) throw new Error("Should the group in the array");
            groups.splice(groupId, 1);
        });

        groups.push(joinedGroup);
    }

    return groups;
}

export default aglomerativo;
