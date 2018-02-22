"use strict";

const express = require("express");
const es6ModuleMiddleware = require("es6-module-server/expressMiddleware.js");

const app = express();

app.use("/src", es6ModuleMiddleware(
    "src",
    require("./es6-module-options.js")
));

app.use(express.static("."));
app.listen(8080);


console.log("http://localhost:8080/");

