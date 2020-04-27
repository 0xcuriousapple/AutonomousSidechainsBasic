var express = require("express"); //npm install express
var bodyParser = require("body-parser"); // npm install body-parser
var http = require("http");
var APP_VERSION = "0.8";
const fs = require('fs')

var PORT = process.env.PORT || 3002;
var app = express();
var server = http.createServer(app);
var io = require("socket.io")(server);

server.listen(PORT, function () {
    console.log(
        "Server running, version " +
        APP_VERSION +
        ", Express is listening... at " +
        PORT +
        " for requests"
    );
});
app.use(bodyParser.json());
app.get("/", function (req, res) {
    res.sendFile("/index.html", { root: __dirname });
});
app.get("/index.js", function (req, res) {
    res.sendFile("/index.js", { root: __dirname });
});

fs.readFile(`./data/test.json`, (err, data) => {
    if (err) throw err;
    obj = JSON.parse(data);
    console.log(obj);
});

io.on("connection", (socket) => {
    socket.emit("data", obj);
});

