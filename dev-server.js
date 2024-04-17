import path from "node:path";
import express from "express";

const __dirname = import.meta.dirname;

const app = express();
app.use(express.static(path.join(__dirname, "src")));

app.listen(3000);
console.info("Listening on port 3000");
