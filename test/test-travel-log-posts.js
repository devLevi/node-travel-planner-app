"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const should = chai.should();

chai.use(chaiHttp);

const { TravelPlan } = require("../models");
const { app, runServer, closeServer } = require("../server");
const { TESTDATABASE_URL } = require("../config.js");

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

// used to put randomish documents in db so we have data to work with and assert about. we use the Faker library to automatically generate placeholder values  and then we insert that data into mongo
function seedTravelPlanData() {
  console.info("seeding travel plan data");
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      title: faker.address.country(),
      seasonToGo: faker.date.month(),
      description: faker.lorem.text(),
      currency: faker.finance.currencyName(),
      words: faker.lorem.text(),
      todo: faker.lorem.text()
    });
  }
  // this will return a promise
  return TravelPlan.insertMany(seedData);
}

describe("travel plans API resource", function() {
  before(function() {
    return runServer(TESTDATABASE_URL);
  });

  beforeEach(function() {
    return seedTravelPlanData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
    it("should return all existing travel plans", function() {
      let res;
      return chai
        .request(app)
        .get("/plans")
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);
          return TravelPlan.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
    });

    it("should return travel plans with right fields", function() {
      let resPlan;
      return chai
        .request(app)
        .get("/plans")
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body.should.have.lengthOf.at.least(1);

          res.body.forEach(function(plan) {
            plan.should.be.a("object");
            plan.should.include.keys(
              "id",
              "title",
              "description",
              "seasonToGo",
              "currency",
              "words",
              "todo"
            );
          });
          // just check one of the plans that its values match with those in db
          // and we'll assume it's true for rest
          resPlan = res.body[0];
          return TravelPlan.findById(resPlan.id);
        })
        .then(plan => {
          resPlan.title.should.equal(plan.title);
          resPlan.seasonToGo.should.equal(plan.seasonToGo);
          resPlan.description.should.equal(plan.description);
          resPlan.currency.should.equal(plan.currency);
          resPlan.words.should.equal(plan.words);
          resPlan.todo.should.equal(plan.todo);
        });
    });
  });
});

describe("POST endpoint", function() {
  // strategy: make a POST request with data,
  // then prove that the post we get back has
  // right keys, and that `id` is there (which means
  // the data was inserted into db)
  it("should add a new travel plan", function() {
    const newPlan = {
      title: faker.address.country(),
      seasonToGo: faker.date.month(),
      description: faker.lorem.text(),
      currency: faker.finance.currencyName(),
      words: faker.lorem.text(),
      todo: faker.lorem.text()
    };

    return chai
      .request(app)
      .post("/plans")
      .send(newPlan)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.include.keys(
          "id",
          "title",
          "description",
          "seasonToGo",
          "currency",
          "words",
          "todo"
        );
        res.body.title.should.equal(newPlan.title);
        // Mongo should have created id on insertion
        res.body.id.should.not.be.null;
        res.body.content.should.equal(newPlan.content);
        return TravelPlan.findById(res.body.id);
      })
      .then(function(plan) {
        plan.title.should.equal(newPlan.title);
        plan.seasonToGo.should.equal(newPlan.seasonToGo);
        plan.description.should.equal(newPlan.description);
        plan.currency.should.equal(newPlan.currency);
        plan.words.should.equal(newPlan.words);
        plan.todo.should.equal(newPlan.todo);
      });
  });
});

describe("PUT endpoint", function() {
  // strategy:
  //  1. Get an existing post from db
  //  2. Make a PUT request to update that post
  //  4. Prove post in db is correctly updated
  it("should update fields you send over", function() {
    const updateData = {
      title: "Costa Pica",
      seasonToGo: "anytime",
      description:
        "Costa Rica is small country in Central America. It is bordered by Nicaragua to the north and Panama to the south. The Caribbean Sea is to the east and the Pacific Ocean is to the west. Costa Rica is slightly smaller than the state of West Virginia.",
      currency: "Costa Rican Colón: 1 Colón = 1 million USD",
      words: "words",
      todo: "do stuff"
    };

    return TravelPlan.findOne()
      .then(plan => {
        updateData.id = plan.id;

        return chai
          .request(app)
          .put(`/plans/${plan.id}`)
          .send(updateData);
      })
      .then(res => {
        res.should.have.status(204);
        return TravelPlan.findById(updateData.id);
      })
      .then(plan => {
        plan.title.should.equal(updateData.title);
        plan.seasonToGo.should.equal(updateData.seasonToGo);
        plan.description.should.equal(updateData.description);
        plan.currency.should.equal(updateData.currency);
        plan.words.should.equal(updateData.words);
        plan.todo.should.equal(updateData.todo);
      });
  });
});

describe("DELETE endpoint", function() {
  // strategy:
  //  1. get a post
  //  2. make a DELETE request for that post's id
  //  3. assert that response has right status code
  //  4. prove that post with the id doesn't exist in db anymore
  it("should delete a post by id", function() {
    let plan;

    return TravelPlan.findOne()
      .then(_plan => {
        post = _plan;
        return chai.request(app).delete(`/plans/${plan.id}`);
      })
      .then(res => {
        res.should.have.status(204);
        return TravelPlan.findById(plan.id);
      })
      .then(_plan => {
        // when a variable's value is null, chaining `should`
        // doesn't work. so `_plan.should.be.null` would raise
        // an error. `should.be.null(_plan)` is how we can
        // make assertions about a null value.
        should.not.exist(_plan);
      });
  });
});
