import { ExcelData, Group, Point } from "../types";
import { addDissimilaridade, dissimilaridade, removeDissimilaridade } from "./dissimilaridade";
import centroid from "./centroid";
import sortByDistance from "./sortByDistance";

function getMostSimilarsGroups(groups: Group[], distances: Point[]): Group[] {
    for (let k = 0; k < distances.length; k++) {
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

function aglomerativo_centroid(clusters: number, data: ExcelData[]): Group[] {
    const groups: Group[] = data.map((_, id) => ({
        items: [id],
        centroid: centroid([id], data),
    }));

    const dissimilarity = dissimilaridade(groups.map((g) => g.centroid!));

    while (groups.length > clusters) {
        const distances = sortByDistance(dissimilarity);

        const similarGroups = getMostSimilarsGroups(groups, distances);

        const joinedGroup = generateNewGroup(similarGroups, data);

        similarGroups.forEach((g1) => {
            const groupId = groups.findIndex((g2) => g1 === g2);
            if (groupId < 0) throw new Error("The group should exist in the array");
            groups.splice(groupId, 1);
            removeDissimilaridade(dissimilarity, groupId);
        });

        groups.push(joinedGroup);
        addDissimilaridade(
            dissimilarity,
            groups.map((g) => g.centroid!)
        );
    }

    groups.forEach((g) => g.items.sort((a, b) => a - b));

    return groups;
}

export default aglomerativo_centroid;
