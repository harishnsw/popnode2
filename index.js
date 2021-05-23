const express = require("express");
const app = express();
var TinyDB = require("tinydb");
mint_db = new TinyDB("./mint.db");
app.use(express.json()); // built-in middleware for express
const fs = require("fs");

var tempMint = [];
const path = "./mint.db";

var handleInsert = function (item) {
  mint_db.insertItem(item, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("[Insert...: ] ");
  });
};

app.get("/", function (req, res) {  
  console.log("db_crud : Live * * * ");
  res.send("db_crud : Live * * * ");
});

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
    fs.unlinkSync(path);
    console.log("file remove");
  } catch (err) {
    console.error(err);
  }

  res.send("Database deleted");
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`)); 

