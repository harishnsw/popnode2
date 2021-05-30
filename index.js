const express = require("express");
const app = express();
const path = require('path')
var TinyDB = require("tinydb");
mint_db = new TinyDB("./mint.db");
app.use(express.json()); // built-in middleware for express
const fs = require("fs");
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var tempMint = [];
var tempList = [];
const dbpath = "./mint.db";

var handleInsert = function (item) {
  mint_db.insertItem(item, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("[Insert...: ] ");
  });
};

//
app.post("/mintAdd", function (req, res) {
  const _key = Date.now();
  const set = req.body.set;
  const mint = req.body.mint;
  const product = req.body.product;
  const owner = "Admin";
  const tag = req.body.tag;

  let _data = { set, mint, product, owner, tag };
  let record = { key: _key, data: _data };
  console.log("Before insert    :", record);

  mint_db.onReady = handleInsert;
  handleInsert(record);

  console.log("After insert    :", record);
  res.send(record);
});

//
var handleFind = function (_key) {
  mint_db.find({ key: _key }, function (err, items) {
    if (err) {
      console.log(err);
      return;
    }
    items.map((item) => {
      console.log(item);
    });
    tempMint.push(items);
    //items.map((person) => console.log(person.title.segment.show));
  });
};

//
app.get("/mintFind/:id", (req, res) => {
  console.log("find........:");
  let _id = parseInt(req.params.id);
  mint_db.onReady = handleFind;
  //handleFind("1621560971443");
  handleFind(_id);
  let items = tempMint.pop();
  res.send(items);
});

app.get("/mintRemove", (req, res) => {
  console.log("Delete........:");
  try {
    fs.unlinkSync(dbpath);
    tempMint = [];
    console.log("file remove");
  } catch (err) {
    console.error(err);
  }

  res.send("Database deleted");
});

var handleList = function () {
  tempList = [];
  console.log("Listing ---------------------> ForEach  :");
  mint_db.forEach(function (err, item) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(item);
    tempList.push(item);
  });
};

app.get("/mintList", (req, res) => {
  console.log("List........:");
  mint_db.onReady = handleList;
  handleList();
  res.send(tempList);
});

app.listen(3009, () => console.log("Listening on port 3009"));
