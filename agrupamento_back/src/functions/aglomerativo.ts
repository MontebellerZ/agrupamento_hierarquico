import { AglomerativeResults, ExcelData, Group, Point } from "../types";
import { addDissimilaridade, dissimilaridade, removeDissimilaridade } from "./dissimilaridade";
import centroid from "./centroid";
import sortByDistance from "./sortByDistance";

function singleLinkage(): Group[] {
    return [];
}

function completeLinkage(): Group[] {
    return [];
}

function centroidLinkage(clusters: number, data: ExcelData[]): Group[] {
    const groups: Group[] = data.map((_, id) => ({
        items: [id],
        centroid: centroid([id], data),
    }));

    const dissimilarity = dissimilaridade(groups.map((g) => g.centroid));

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
            groups.map((g) => g.centroid)
        );
    }

    return groups;
}

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

function aglomerativo(clusters: number, data: ExcelData[]): AglomerativeResults {
    const results: AglomerativeResults = {
        singleLinkage: singleLinkage(),
        completeLinkage: completeLinkage(),
        centroidLinkage: centroidLinkage(clusters, data),
    };

    return results;
}

export default aglomerativo;
