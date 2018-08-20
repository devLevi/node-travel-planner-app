'use strict';
const express = require('express');

const { TravelPlan } = require('./models');

const router = express.Router();

router.use(express.json());
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });
router.use(jwtAuth);

// GET request
router.get('/', (req, res) => {
    TravelPlan.find({ username: req.user.username })
        .then(plans => {
            res.json({
                plans: plans.map(plan => plan.serialize())
            });
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' });
        });
});

// GET by id
router.get('/:id', (req, res) => {
    TravelPlan.findById(req.params.id)
        .then(plan => {
            if (req.user.username === plan.username) {
                res.json(plan.serialize());
            } else {
                res.status(401).json({ message: 'Unauthorized user' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

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
        .then(plan => res.status(201).json(plan.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Something went wrong' });
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
            if (req.user.username === plan.username) {
                TravelPlan.findByIdAndUpdate(req.params.id, {
                    $set: toUpdate
                }).then(plan => res.status(204).end());
            } else {
                res.status(401).json({ message: 'Unauthorized user' });
            }
        })

        .catch(err =>
            res.status(500).json({ message: 'Something went wrong' })
        );
});

// DELETE request
router.delete('/:id', (req, res) => {
    TravelPlan.findById(req.params.id)
        .then(function(plan) {
            if (req.user.username === plan.username) {
                TravelPlan.findByIdAndRemove(req.params.id).then(plan =>
                    res.status(204).end()
                );
            } else {
                res.status(401).json({ message: 'Unauthorized user' });
            }
        })
        .catch(err =>
            res.status(500).json({ message: 'Internal server error' })
        );
});

module.exports = { router };
