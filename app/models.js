"use strict";

const mongoose = require("mongoose");

// this is our schema to represent a restaurant
const travelPlanSchema = mongoose.Schema({
  title: { type: String, required: true },
  season: { type: String, required: true },
  descripion: { type: String, required: true },
  currency: { type: String, required: true },
  words: { type: String, required: true },
  todo: { type: String, required: true },
  notes: { type: String, required: true }
});

travelPlanSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    season: this.season,
    descripion: this.description,
    currency: this.currency,
    words: this.words,
    todo: this.todo,
    notes: this.notes
  };
};

const TravelPlan = mongoose.model("TravelPlan", travelPlanSchema);

module.exports = { TravelPlan };
