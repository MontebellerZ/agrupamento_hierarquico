import { ExcelData, SheetType } from "../types";

function writeDissimilaridade() {}

function writeDivisivo() {}

function writeAgregativo() {}

function writeExcel(path: string, sheet: SheetType, data: ExcelData[]) {
    if (!path || !sheet || !data) throw new Error("Missing data to write excel");

    switch (sheet) {
        case "Dissimilaridade":
            return writeDissimilaridade();
        case "Agregativo":
            return writeAgregativo();
        case "Divisivo":
            return writeDivisivo();
    }
}

export default writeExcel;
