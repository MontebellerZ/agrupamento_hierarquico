import xlsx from "xlsx";

function readExcel(filepath: string): any[] {
    const wb = xlsx.readFile(filepath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data: any[] = xlsx.utils.sheet_to_json(ws);
    return data;
}

export default readExcel;
