// server.js

// init project
const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, Model, DataTypes } = require("sequelize");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite111.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);
const sequelize = new Sequelize("sqlite::memory:");

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

sequelize.sync();

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Req (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, product_name TEXT, comments TEXT)"
    );
    console.log("New table Req created");
  } else {
    console.log('Database "Req" ready to go!');
    //
    db.run(`PRAGMA read_uncommitted = 0`);
    // start indexes
    db.run(`CREATE INDEX IF NOT EXISTS ind_one ON Req(id)`);
    // end indexes
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the user in the database
app.get("/getReq", (request, response) => {
  db.all("SELECT * from Req", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// endpoint to add a user to the database
app.post("/addReq", (request, response) => {
  console.log(`add to Req table ${request.body.item}`);
  if (!process.env.DISALLOW_WRITE) {
    const cleansedtitle = cleanseString(request.body.title);
    const cleanseddescription = cleanseString(request.body.description);
    const cleansedcontact = cleanseString(request.body.contact);
    db.run(`BEGIN TRANSACTION EXCLUSIVE;`);
    db.run(
      `INSERT INTO Req (name, product_name, comments) VALUES (?,?,?)`,
      cleansedtitle,
      cleanseddescription,
      cleansedcontact,
      error => {
        if (error) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
    db.run(`COMMIT;`);
  }
});

/////////

/////////

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
