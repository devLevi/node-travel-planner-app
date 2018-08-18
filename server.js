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

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
