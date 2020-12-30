require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const blogRouter = require("./routes/blog");

const db = require("./config/db/index");

const app = express();

app.use(cors());

//Connect to Mongodb
db.connect();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/blog", blogRouter);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  //   const path = require("path");
  //   app.get("*", (req, res) => {
  //     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  //   });
}

module.exports = app;
