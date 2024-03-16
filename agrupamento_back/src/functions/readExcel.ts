import xlsx from "xlsx";

function readExcel(filepath: string) {
    const wb = xlsx.readFile(filepath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(ws);
    return data;
}

export default readExcel;
