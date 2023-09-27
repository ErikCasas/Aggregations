const express = require("express");
const main = require("./db/index.js");

const route = require("./routes/index.js");

const app = express();

app.use(express.json());

app.use(route);

app.listen(3001, () => console.log("server on port 3001"));
