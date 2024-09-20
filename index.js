require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080

mongoose.connect("mongodb://127.0.0.1:27017/chatappdb")
.then((e)=>console.log("connected to server"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.static(path.resolve("./public")));
app.use('/',userRoutes);

app.listen(PORT,()=>console.log(`server started at ${PORT}`));