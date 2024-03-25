import express from "express";
import multer from "multer";
import initialize from "./functions/initialize";
import route_aglomerativo from "./route/route_aglomerativo";
import route_divisivo from "./route/route_divisivo";

const upload = multer({ dest: "./public/" });

const app = express();

app.post("/divisivo", upload.single("excel"), initialize, route_divisivo);

app.post("/aglomerativo", upload.single("excel"), initialize, route_aglomerativo);

app.listen(3001, () => {
	console.log("Listening on port 3001");
});
