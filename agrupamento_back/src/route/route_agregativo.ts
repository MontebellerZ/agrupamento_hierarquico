import { Response } from "express";
import { RequestAgregamento } from "../types";
import divisivo from "../functions/divisivo";
import normalizarDados from "../functions/normalizarDados";

function route_agregativo(req: RequestAgregamento, res: Response) {
	const data = req.excelData;
	const clusters = req.clusters;

	if (!data || !clusters) throw new Error("Excel data ou Clusters não foi encontrado");

	normalizarDados(data);

	const divisive = divisivo(clusters, data);

	const indexes = divisive.map((g) => g.items);

	res.send(indexes);
}

export default route_agregativo;
