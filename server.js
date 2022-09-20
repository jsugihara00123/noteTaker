// Dependencies ////////////////////////////////////////////////////////////
let express = require("express");
let path = require("path");
let fs = require("fs");
let colors = require('colors');

// Sets up the Express App and middlewear /////////////////////////////////
let app = express();
let PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes //////////////////////////////////////////////////////////////////
// display notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// api endpoint for grabbing info
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "db/db.json"));
});


// adding a note
app.post("/api/notes", function (req, res) {
  let newNote = req.body;
  let dbLocation = path.join(__dirname, "db/db.json");
  fs.readFile(dbLocation, 'utf8', function (err, data) {
    if (err) throw err;
    // grab the existing JSON and turn it into an array
    let oldData = JSON.parse(data);
    // add unique id based on number of notes and note title
    newNote.id = oldData.length + newNote.title;
    // add the new note
    oldData.push(newNote);
    // turn it BACK into a string
    let update = JSON.stringify(oldData);
    //rewrite the JSON file
    fs.writeFile(dbLocation, update, function (err) {
      if (err) throw err;
    });
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });
});


// main page & catchall
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});



// delete a single note
app.delete("/api/notes/:id", function (req, res) {
  let noteIndex = req.params.id;
  let dbLocation = path.join(__dirname, "db/db.json");

  fs.readFile(dbLocation, 'utf8', function (err, data) {
    if (err) throw err;
    let oldData = JSON.parse(data);
    for (let i = 0; i < oldData.length; i++) {
      if (oldData[i].id === noteIndex) {
        //remove the matching note
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

// Server start and console message //////////////////////////////
app.listen(PORT, function () {
  console.log("App listening on PORT ".cyan + colors.brightGreen.underline(PORT));
});