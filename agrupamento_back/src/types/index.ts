export type ExcelData = {
    [name: string]: string | number;
};

export type SheetType = "Dissimilaridade" | "Agregativo" | "Divisivo";

export type DissimilarityPoint = {
    i: number;
    j: number;
    value: number;
};
