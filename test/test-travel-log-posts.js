"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const { app, runServer, closeServer } = require("../server");

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);

describe("plans", function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  `chai.request.get` is an asynchronous operation. When
  using Mocha with async operations, we need to either
  return an ES6 promise or else pass a `done` callback to the
  test that we call at the end. We prefer the first approach, so
  we just return the chained `chai.request.get` object.
  it("should list plans on GET", function() {
    return chai
      .request(app)
      .get("/plans")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("string");
        expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.have.all.keys(
            "id",
            "title",
            "seasonToGO",
            "description",
            "currency",
            "words",
            "todo"
          );
        });
      });
  });
});
