'use strict';
const express = require('express');

const router = express.Router();
const passport = require('passport');
const { TravelPlan } = require('./models');

router.use(express.json());

const jwtAuth = passport.authenticate('jwt', { session: false });
router.use(jwtAuth);

//POST request
router.post('/', (req, res) => {
    //ensure all the fields are in req body
    const requiredFields = [
        'title',
        'seasonToGo',
        'description',
        'currency',
        'words',
        'todo'
    ];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing  ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    TravelPlan.create({
        title: req.body.title,
        seasonToGo: req.body.seasonToGo,
        description: req.body.description,
        currency: req.body.currency,
        words: req.body.words,
        todo: req.body.todo
    })
        .then(plan => {
            return res.status(201).json(plan.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
});

//GET request
router.get('/', (req, res) => {
    TravelPlan.find() // REMOVED USERNAME REQ
        .then(plans => {
            res.json({
                plans: plans.map(plan => plan.serialize())
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

// PUT request
router.put('/:id', (req, res) => {
    //ensure the the id in req path and the req body match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }
    const toUpdate = {};
    const updateableFields = [
        'title',
        'seasonToGo',
        'description',
        'currency',
        'words',
        'todo'
    ];
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    TravelPlan.findById(req.params.id)
        .then(function(plan) {
            if (req.user.email === plan.email) {
                TravelPlan.findByIdAndUpdate(req.params.id, {
                    $set: toUpdate
                }).then(() => res.status(204).end());
            } else {
                res.status(401).json({ message: 'Unauthorized user' });
            }
        })
        .catch(() => res.status(500).json({ message: 'Something went wrong' }));
});

// DELETE request
router.delete('/:id', (req, res) => {
    TravelPlan.findById(req.params.id)
        .then(plan => {
            if (req.user.email === plan.email) {
                TravelPlan.findByIdAndRemove(req.params.id).then(() =>
                    res.status(204).end()
                );
            } else {
                res.status(401).json({ message: 'Unauthorized user' });
            }
        })
        .catch(() =>
            res.status(500).json({ message: 'Internal server error' })
        );
});

module.exports = { router };
