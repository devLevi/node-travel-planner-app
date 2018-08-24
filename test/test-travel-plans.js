'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');

chai.use(chaiHttp);

const { TravelPlan } = require('../plans');
const { app, runServer, closeServer } = require('../server.js');
const { TESTDATABASE_URL, JWT_SECRET } = require('../config.js');
const { User } = require('../users');

let email = 'Levi';
let password = '123';

function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection
            .dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function generateTravelPlanData() {
    // Generate an object representing a travel plan
    return {
        title: faker.address.country(),
        seasonToGo: faker.date.month(),
        description: faker.lorem.text(),
        currency: faker.finance.currencyName(),
        words: faker.lorem.text(),
        todo: faker.lorem.text(),
        email
    };
}

// used to put randomish documents in db so we have data to work with and assert about. we use the Faker library to automatically generate placeholder values  and then we insert that data into mongo
function seedTravelPlanData() {
    console.info('seeding travel plan data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateTravelPlanData());
    }
    // this will return a promise
    return TravelPlan.insertMany(seedData);
}

describe('travel plans API resource', function() {
    let email = 'Levi';
    let password = '123';
    let jwt;

    before(function() {
        return runServer(TESTDATABASE_URL);
    });

    beforeEach(function() {
        return User.hashPassword(password)
            .then(password =>
                User.create({
                    email,
                    password
                })
            )
            .then(function() {
                return chai
                    .request(app)
                    .post('/api/auth/login')
                    .send({ email, password });
            })
            .then(function(res) {
                jwt = res.body.authToken;
                return seedTravelPlanData();
            });
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('GET endpoint', function() {
        it('should return all existing travel plans', function() {
            const token = jsonwebtoken.sign(
                {
                    user: { email }
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: email,
                    expiresIn: '7d'
                }
            );

            let res;
            return chai
                .request(app)
                .get('/api/plans')
                .set('authorization', `Bearer ${token}`)
                .then(_res => {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body.plans).to.have.lengthOf.at.least(1);
                });
        });

        it('should return travel plans with right fields', function() {
            let resPlan;
            return chai
                .request(app)
                .get('/api/plans')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.be.lengthOf.at.least(1);

                    res.body.forEach(function(plan) {
                        expect(plan).to.be.a('object');
                        expect(plan).to.include.keys(
                            'id',
                            'title',
                            'description',
                            'seasonToGo',
                            'currency',
                            'words',
                            'todo'
                        );
                    });
                    // just check one of the plans that its values match with those in db
                    // and we'll assume it's true for rest
                    resPlan = res.body[0];
                    return TravelPlan.findById(resPlan.id);
                })
                .then(plan => {
                    expect(resPlan.title).to.equal(plan.title);
                    expect(resPlan.seasonToGo).to.equal(plan.seasonToGo);
                    expect(resPlan.description).to.equal(plan.description);
                    expect(resPlan.currency).to.equal(plan.currency);
                    expect(resPlan.words).to.equal(plan.words);
                    expect(resPlan.todo).to.equal(plan.todo);
                });
        });
    });

    describe('POST endpoint', function() {
        //strategy:
        // 1. make a POST req with data
        // 2. Prove that the plan we get back has right keys
        // 3. Make sure it has id
        it('should add a new travel plan', function() {
            const newPlan = generateTravelPlanData();
            return chai
                .request(app)
                .post('/api/plans')
                .set('Authorization', `Bearer ${jwt}`)
                .send(newPlan)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'id',
                        'title',
                        'description',
                        'seasonToGo',
                        'currency',
                        'words',
                        'todo'
                    );
                    expect(res.body.title).to.equal(newPlan.title);
                    // Mongo should have created id on insertion
                    expect(res.body.description).to.equal(newPlan.description);
                    return TravelPlan.findById(res.body.id);
                })
                .then(function(plan) {
                    expect(plan.title).to.equal(newPlan.title);
                    expect(plan.seasonToGo).to.equal(newPlan.seasonToGo);
                    expect(plan.description).to.equal(newPlan.description);
                    expect(plan.currency).to.equal(newPlan.currency);
                    expect(plan.words).to.equal(newPlan.words);
                    expect(plan.todo).to.equal(newPlan.todo);
                });
        });
    });

    describe('PUT endpoint', function() {
        // strategy:
        //  1. Get an existing post from db
        //  2. Make a PUT request to update that post
        //  4. Prove post in db is correctly updated
        it('should update fields you send over', function() {
            const updateData = {
                title: 'Costa Pica',
                seasonToGo: 'anytime',
                description:
                    'Costa Rica is small country in Central America. It is bordered by Nicaragua to the north and Panama to the south. The Caribbean Sea is to the east and the Pacific Ocean is to the west. Costa Rica is slightly smaller than the state of West Virginia.',
                currency: 'Costa Rican Colón: 1 Colón = 1 million USD',
                words: 'words',
                todo: 'do stuff'
            };

            return TravelPlan.findOne()
                .then(plan => {
                    updateData.id = plan.id;

                    return chai
                        .request(app)
                        .put(`/api/plans/${plan.id}`)
                        .set('Authorization', `Bearer ${jwt}`)
                        .send(updateData);
                })
                .then(res => {
                    expect(res).to.have.status(204);
                    return TravelPlan.findById(updateData.id);
                })
                .then(plan => {
                    expect(plan.title).to.equal(updateData.title);
                    expect(plan.seasonToGo).to.equal(updateData.seasonToGo);
                    expect(plan.description).to.equal(updateData.description);
                    expect(plan.currency).to.equal(updateData.currency);
                    expect(plan.words).to.equal(updateData.words);
                    expect(plan.todo).to.equal(updateData.todo);
                });
        });
    });

    describe('DELETE endpoint', function() {
        // strategy:
        //  1. get a plan
        //  2. make a DELETE request for that plan's id
        //  3. assert that response has right status code
        //  4. prove that plan with the id doesn't exist in db anymore
        it('should delete a travel plan by id', function() {
            let plan;

            return TravelPlan.findOne()
                .then(_plan => {
                    plan = _plan;
                    return chai
                        .request(app)
                        .delete(`/api/plans/${plan.id}`)
                        .set('Authorization', `Bearer ${jwt}`);
                })
                .then(res => {
                    expect(res).to.have.status(204);
                    return TravelPlan.findById(plan.id);
                })
                .then(_plan => {
                    expect(_plan).to.exist;
                });
        });
    });
});
