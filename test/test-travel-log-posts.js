"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const { app, runServer, closeServer } = require("../server");

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);

describe("server response", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it("should return 400", function() {
    return chai
      .request(app)
      .get("http://localhost:8080")
      .then(function(res) {
        res.should.have.status(400);
      });
  });
});
