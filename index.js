const express = require("express");

const app = express();

var server = app.listen(4000,function () {
    console.log("server is running");
});

app.use(express.static("public"));