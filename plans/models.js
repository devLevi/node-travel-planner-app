'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const travelPlanSchema = mongoose.Schema({
    title: { type: String, required: true },
    seasonToGo: { type: String, required: true },
    description: { type: String, required: true },
    currency: { type: String, required: true },
    words: { type: String, required: true },
    todo: { type: String, required: true },
    email: { type: String, required: true }
});

travelPlanSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        seasonToGo: this.seasonToGo,
        description: this.description,
        currency: this.currency,
        words: this.words,
        todo: this.todo,
        email: this.email
    };
};

const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);

module.exports = { TravelPlan };
