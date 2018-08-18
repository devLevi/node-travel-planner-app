"use strict";

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require("./config");
const { TravelPlan } = require("./models");

const app = express();

app.use(morgan("common"));
app.use(express.json());

app.get("/plans", (req, res) => {
  TravelPlan.find()
    .then(plans => {
      res.json(plans.map(plan => plan.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

app.get("/plans/:id", (req, res) => {
  TravelPlan.findById(req.params.id)
    .then(plan => res.json(plan.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went horribly awry" });
    });
});

app.post("/plans", (req, res) => {
  const requiredFields = [
    "title",
    "seasonToGo",
    "description",
    "currency",
    "words",
    "todo"
  ];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  TravelPlan.create({
    title: req.body.title,
    seasonToGO: req.body.seasonToGO,
    description: req.body.description,
    currency: req.body.currency,
    words: req.body.words,
    todo: req.body.todo
  })
    .then(travelPlan => res.status(201).json(travelPlan.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.delete("/plans/:id", (req, res) => {
  TravelPlan.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

app.put("/plans/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  const updated = {};
  const updateableFields = [
    "title",
    "seasonToGo",
    "description",
    "currency",
    "words",
    "todo"
  ];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  TravelPlan.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPlan => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
});

app.delete("/:id", (req, res) => {
  TravelPlan.findByIdAndRemove(req.params.id).then(() => {
    console.log(`Deleted travel plan with id \`${req.params.id}\``);
    res.status(204).end();
  });
});

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});
// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}
