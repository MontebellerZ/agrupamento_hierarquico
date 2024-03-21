import { Response, NextFunction } from "express";
import { ExcelData, RequestAgregamento } from "../types";
import readExcel from "./readExcel";

function initialize(req: RequestAgregamento, res: Response, next: NextFunction) {
	const excel = req.file;
	const clusters = Number(req.body.clusters);

	if (!excel) return res.status(400).send("Nenhum arquivo foi enviado.");
	if (!clusters || isNaN(clusters))
		return res.status(400).send("Quantidade de Clusters precisa ser um número maior que 0.");

	const data: ExcelData[] = readExcel(excel.path);

	if (clusters > data.length) {
		return res
			.status(400)
			.send(
				`Quantidade de Clusters deve ser <= ao total de items no excel (${data.length}).`
			);
	}

	req.clusters = clusters;
	req.excelData = data;

	next();
}

export default initialize;
