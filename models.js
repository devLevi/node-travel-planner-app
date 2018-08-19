"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const travelPlanSchema = mongoose.Schema({
  title: String,
  seasonToGo: String,
  description: String,
  currency: String,
  words: String,
  todo: String
});

travelPlanSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    seasonToGo: this.seasonToGo,
    description: this.description,
    currency: this.currency,
    words: this.words,
    todo: this.todo
  };
};

const TravelPlan = mongoose.model("TravelPlan", travelPlanSchema);

module.exports = { TravelPlan };
