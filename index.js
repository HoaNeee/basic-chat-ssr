const express = require("express");
require("dotenv").config();

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const http = require("http");
const app = express();

const server = http.createServer(app);

//socket
const { Server } = require("socket.io");
const io = new Server(server);

global._io = io;

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

//flash notify basic
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

app.use(cookieParser("abcyxz"));
app.use(session({ cookie: { maxAge: 600000 } }));
app.use(flash());

//public
app.use(express.static("public"));

//views
app.set("views", `views`);
app.set("view engine", "pug");

//connect db
const database = require("./config/database");
database.connect();

//route app
const route = require("./routes/index.route");
route(app);

const PORT = process.env.PORT;
server.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is running at port ${PORT}`);
  }
});
