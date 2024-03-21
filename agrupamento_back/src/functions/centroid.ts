import { ExcelData } from "../types";

function centroid(group: number[], data: ExcelData[]) {
    if (!data.length) throw new Error("Data deve haver pelo menos um item");

    const keys = Object.keys(data[0]).filter((key) => typeof data[0][key] === "number");

    if (!keys.length) throw new Error("Deve haver ao menos uma célula númerica.");

    const groupData = data.filter((_, i) => group.includes(i));

    const newCentroid: ExcelData = {};

    keys.forEach((key) => {
        newCentroid[key] =
            groupData.reduce((sum, d) => sum + (d[key] as number), 0) / groupData.length;
    });

    return newCentroid;
}

export default centroid;
