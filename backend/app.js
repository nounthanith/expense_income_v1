const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
dotenv.config({quiet: true});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(require("./modules/users/users.route"));
app.use(require("./modules/categories/categories.route"));
app.use(require("./modules/Transaction/transaction.route"));

module.exports = app;
