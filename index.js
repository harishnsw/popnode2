const express = require("express");
const app = express();
const path = require('path')
const fs = require("fs");

app.use(express.json()); // built-in middleware for express
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var TinyDB = require("tinydb");

//variables
mint_db = new TinyDB("./mint.db");
const PORT = process.env.PORT || 5000
var tempMint = [];
var tempList = [];
const dbpath = "./mint.db";

/* fn Insert */
var handleInsert = function (item) {
  mint_db.insertItem(item, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("[Insert...: ] ");
  });
};

/* get Add */
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

/* fn Find */
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

/* get Find */
app.get("/mintFind/:id", (req, res) => {
  console.log("find........:");
  let _id = parseInt(req.params.id);
  mint_db.onReady = handleFind;
  //handleFind("1621560971443");
  handleFind(_id);
  let items = tempMint.pop();
  res.send(items);
});

/*  List Remove  */
var handleListRemove = function () {
  tempList = [];
  mint_db.forEach(function (err, item) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Item :", item._id);
    mint_db.findByIdAndRemove(item._id, function (err, item) {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
};

/* Map Remove */
var handleMapRemove = function () {
  tempList.map((item) => {
    console.log("Item :", item._id);
    mint_db.findByIdAndRemove(item._id, function (err, item) {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
};

/* GET Remove */
app.get("/mintRemove", (req, res) => {
  console.log("Delete........:");
  mint_db.onReady = handleList;
  handleList();

  mint_db.onReady = handleMapRemove;
  handleMapRemove();
  res.send("Database deleted");
});

/*  fn List  */
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

/* get List*/
app.get("/mintList", (req, res) => {
  console.log("List........:");
  mint_db.onReady = handleList;
  handleList();
  res.send(tempList);
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`)); 
