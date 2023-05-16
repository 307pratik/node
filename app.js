
const express = require("express");
const mongodb = require("mongodb");

var MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");
const app = express();
var router = express.Router();

var url =
  "mongodb+srv://307pratik:307pratik@cluster0.mdvpoll.mongodb.net/?retryWrites=true&w=majority";

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
var dbo;

MongoClient.connect(url, function (err, db) {
  if (err) throw err;

  dbo = db.db("mydb");
});

app.use("/insert", (req, res, next) => {
  res.render("insert", { tittle: "insert" });
});
app.use("/update/(:id)", (req, res, next) => {
  console.log(req.params);
  res.render("update", { user: req.params });
});
app.post("/post-feedback", function (req, res) {
  dbo.collection("customers").insertOne(req.body);

  res.json(req.body);
  //res.send("Data received:\n" + JSON.stringify(req.body));
  res.redirect("/user");
});

app.get("/delete-user/(:id)", function (req, res) {
  let userId = req.params.id;
  var query = { _id: new mongodb.ObjectID(userId) };
  dbo.collection("customers").deleteOne(query, function (err, resq) {
    if (err) throw err;
    res.json({ message: " User Deleted" });

    res.redirect("/user");
  });
});

app.use("/user", (req, res, next) => {
  dbo
    .collection("customers")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.render("user", { user: result });
    });
});

app.post("/post-update/(:id)", (req, res, next) => {
  let userId = req.params.id;
  let newName = req.body.name;
  let newAdress = req.body.address;
  var query = { _id: new mongodb.ObjectID(userId) };
  var newvalues = { $set: { name: newName, address: newAdress } };
  dbo.collection("customers").updateOne(query, newvalues, function (err, resq) {
    if (err) throw err;

    res.json({ message: "user updated" });
    console.log(userId);
    console.log(newName);
    console.log(newAdress);
    res.redirect("/user");
  });
});

app.use("/", (req, res, next) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo
      .collection("customers")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });
});

app.listen(8080);
