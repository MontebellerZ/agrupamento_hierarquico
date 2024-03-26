import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import initialize from "./functions/initialize";
import route_aglomerativo from "./routes/route_aglomerativo";
import route_divisivo from "./routes/route_divisivo";

const upload = multer({ dest: "./public/" });

const app = express();

app.post("/divisivo", upload.single("excel"), initialize, route_divisivo);

app.post("/aglomerativo/:type?", upload.single("excel"), initialize, route_aglomerativo);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(err.message);
});

app.listen(3001, () => {
    console.log("Listening on port 3001");
});
