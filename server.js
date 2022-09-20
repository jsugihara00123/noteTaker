let express = require("express");
let path = require("path");
let fs = require("fs");
let colors = require('colors');

let app = express();
let PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "db/db.json"));
});


app.post("/api/notes", function (req, res) {
  let newNote = req.body;
  let dbLocation = path.join(__dirname, "db/db.json");
  fs.readFile(dbLocation, 'utf8', function (err, data) {
    if (err) throw err;
    let oldData = JSON.parse(data);
    newNote.id = oldData.length + newNote.title;
    oldData.push(newNote);
    let update = JSON.stringify(oldData);
    fs.writeFile(dbLocation, update, function (err) {
      if (err) throw err;
    });
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });
});


app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});



app.delete("/api/notes/:id", function (req, res) {
  let noteIndex = req.params.id;
  let dbLocation = path.join(__dirname, "db/db.json");

  fs.readFile(dbLocation, 'utf8', function (err, data) {
    if (err) throw err;
    let oldData = JSON.parse(data);
    for (let i = 0; i < oldData.length; i++) {
      if (oldData[i].id === noteIndex) {
        oldData.splice(i, 1);
      }
    }

    let update = JSON.stringify(oldData);
    fs.writeFile(dbLocation, update, function (err) {
      if (err) throw err;
    });
  });
  res.sendFile(path.join(__dirname, "public/notes.html"));

});

app.listen(PORT, function () {
  console.log("App listening on PORT ".cyan + colors.brightGreen.underline(PORT));
});