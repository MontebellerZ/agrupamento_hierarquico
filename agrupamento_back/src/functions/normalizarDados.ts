import { ExcelData } from "../types";

function normalizarDados(data: ExcelData[]): ExcelData[] {
    const headers = Object.keys(data[0]);

    headers.forEach((h) => {
        if (typeof data[0][h] === "string") return;

        let min: number = NaN;
        let max: number = NaN;

        for (let i = 0; i < data.length; i++) {
            const val = data[i][h] as number;
            if (isNaN(min) || min > val) min = val;
            if (isNaN(max) || max < val) max = val;
        }

        for (let i = 0; i < data.length; i++) {
            const val = data[i][h] as number;
            data[i][h] = (val - min) / (max - min);
        }
    });

    return data;
}

export default normalizarDados;
