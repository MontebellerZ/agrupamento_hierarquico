import { Request } from "express";

export type RequestAgregamento = Request & {
	excelData?: ExcelData[];
	clusters?: number;
};

export type ExcelData = {
	[name: string]: string | number;
};

export type SheetType = "Dissimilaridade" | "Agregativo" | "Divisivo";

export type Point = {
	i: number;
	j: number;
	value: number;
};

export type RelatedGroups = {
	a: Point[];
	b: Point[];
};

export type Group = {
	items: number[];
	centroid: ExcelData;
	sse: number;
	furthests: Point;
};
