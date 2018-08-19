"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Travel Plans", function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it("should list plans on GET", function(done) {
    chai
      .request(app)
      .get("/plans")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("string");
        expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item) {
          expect(plan).to.be.a("object");
          expect(plan).to.have.all.keys(
            "id",
            "title",
            "seasonToGO",
            "description",
            "currency",
            "words",
            "todo"
          );
          done();
        });
      });
  });
});
