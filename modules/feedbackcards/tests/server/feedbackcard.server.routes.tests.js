'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Feedbackcard = mongoose.model('Feedbackcard'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, feedbackcard;

/**
 * Feedbackcard routes tests
 */
describe('Feedbackcard CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Feedbackcard
    user.save(function () {
      feedbackcard = {
        name: 'Feedbackcard name'
      };

      done();
    });
  });

  it('should be able to save a Feedbackcard if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Feedbackcard
        agent.post('/api/feedbackcards')
          .send(feedbackcard)
          .expect(200)
          .end(function (feedbackcardSaveErr, feedbackcardSaveRes) {
            // Handle Feedbackcard save error
            if (feedbackcardSaveErr) {
              return done(feedbackcardSaveErr);
            }

            // Get a list of Feedbackcards
            agent.get('/api/feedbackcards')
              .end(function (feedbackcardsGetErr, feedbackcardsGetRes) {
                // Handle Feedbackcard save error
                if (feedbackcardsGetErr) {
                  return done(feedbackcardsGetErr);
                }

                // Get Feedbackcards list
                var feedbackcards = feedbackcardsGetRes.body;

                // Set assertions
                (feedbackcards[0].user._id).should.equal(userId);
                (feedbackcards[0].name).should.match('Feedbackcard name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Feedbackcard if not logged in', function (done) {
    agent.post('/api/feedbackcards')
      .send(feedbackcard)
      .expect(403)
      .end(function (feedbackcardSaveErr, feedbackcardSaveRes) {
        // Call the assertion callback
        done(feedbackcardSaveErr);
      });
  });

  it('should not be able to save an Feedbackcard if no name is provided', function (done) {
    // Invalidate name field
    feedbackcard.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Feedbackcard
        agent.post('/api/feedbackcards')
          .send(feedbackcard)
          .expect(400)
          .end(function (feedbackcardSaveErr, feedbackcardSaveRes) {
            // Set message assertion
            (feedbackcardSaveRes.body.message).should.match('Please fill Feedbackcard name');

            // Handle Feedbackcard save error
            done(feedbackcardSaveErr);
          });
      });
  });

  it('should be able to update an Feedbackcard if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Feedbackcard
        agent.post('/api/feedbackcards')
          .send(feedbackcard)
          .expect(200)
          .end(function (feedbackcardSaveErr, feedbackcardSaveRes) {
            // Handle Feedbackcard save error
            if (feedbackcardSaveErr) {
              return done(feedbackcardSaveErr);
            }

            // Update Feedbackcard name
            feedbackcard.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Feedbackcard
            agent.put('/api/feedbackcards/' + feedbackcardSaveRes.body._id)
              .send(feedbackcard)
              .expect(200)
              .end(function (feedbackcardUpdateErr, feedbackcardUpdateRes) {
                // Handle Feedbackcard update error
                if (feedbackcardUpdateErr) {
                  return done(feedbackcardUpdateErr);
                }

                // Set assertions
                (feedbackcardUpdateRes.body._id).should.equal(feedbackcardSaveRes.body._id);
                (feedbackcardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Feedbackcards if not signed in', function (done) {
    // Create new Feedbackcard model instance
    var feedbackcardObj = new Feedbackcard(feedbackcard);

    // Save the feedbackcard
    feedbackcardObj.save(function () {
      // Request Feedbackcards
      request(app).get('/api/feedbackcards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Feedbackcard if not signed in', function (done) {
    // Create new Feedbackcard model instance
    var feedbackcardObj = new Feedbackcard(feedbackcard);

    // Save the Feedbackcard
    feedbackcardObj.save(function () {
      request(app).get('/api/feedbackcards/' + feedbackcardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', feedbackcard.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Feedbackcard with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/feedbackcards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Feedbackcard is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Feedbackcard which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Feedbackcard
    request(app).get('/api/feedbackcards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Feedbackcard with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Feedbackcard if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Feedbackcard
        agent.post('/api/feedbackcards')
          .send(feedbackcard)
          .expect(200)
          .end(function (feedbackcardSaveErr, feedbackcardSaveRes) {
            // Handle Feedbackcard save error
            if (feedbackcardSaveErr) {
              return done(feedbackcardSaveErr);
            }

            // Delete an existing Feedbackcard
            agent.delete('/api/feedbackcards/' + feedbackcardSaveRes.body._id)
              .send(feedbackcard)
              .expect(200)
              .end(function (feedbackcardDeleteErr, feedbackcardDeleteRes) {
                // Handle feedbackcard error error
                if (feedbackcardDeleteErr) {
                  return done(feedbackcardDeleteErr);
                }

                // Set assertions
                (feedbackcardDeleteRes.body._id).should.equal(feedbackcardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Feedbackcard if not signed in', function (done) {
    // Set Feedbackcard user
    feedbackcard.user = user;

    // Create new Feedbackcard model instance
    var feedbackcardObj = new Feedbackcard(feedbackcard);

    // Save the Feedbackcard
    feedbackcardObj.save(function () {
      // Try deleting Feedbackcard
      request(app).delete('/api/feedbackcards/' + feedbackcardObj._id)
        .expect(403)
        .end(function (feedbackcardDeleteErr, feedbackcardDeleteRes) {
          // Set message assertion
          (feedbackcardDeleteRes.body.message).should.match('User is not authorized');

          // Handle Feedbackcard error error
          done(feedbackcardDeleteErr);
        });

    });
  });

  it('should be able to get a single Feedbackcard that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Feedbackcard
          agent.post('/api/feedbackcards')
            .send(feedbackcard)
            .expect(200)
            .end(function (feedbackcardSaveErr, feedbackcardSaveRes) {
              // Handle Feedbackcard save error
              if (feedbackcardSaveErr) {
                return done(feedbackcardSaveErr);
              }

              // Set assertions on new Feedbackcard
              (feedbackcardSaveRes.body.name).should.equal(feedbackcard.name);
              should.exist(feedbackcardSaveRes.body.user);
              should.equal(feedbackcardSaveRes.body.user._id, orphanId);

              // force the Feedbackcard to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Feedbackcard
                    agent.get('/api/feedbackcards/' + feedbackcardSaveRes.body._id)
                      .expect(200)
                      .end(function (feedbackcardInfoErr, feedbackcardInfoRes) {
                        // Handle Feedbackcard error
                        if (feedbackcardInfoErr) {
                          return done(feedbackcardInfoErr);
                        }

                        // Set assertions
                        (feedbackcardInfoRes.body._id).should.equal(feedbackcardSaveRes.body._id);
                        (feedbackcardInfoRes.body.name).should.equal(feedbackcard.name);
                        should.equal(feedbackcardInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Feedbackcard.remove().exec(done);
    });
  });
});
