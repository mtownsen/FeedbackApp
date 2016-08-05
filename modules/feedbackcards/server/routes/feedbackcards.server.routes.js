'use strict';

/**
 * Module dependencies
 */
var feedbackcardsPolicy = require('../policies/feedbackcards.server.policy'),
  feedbackcards = require('../controllers/feedbackcards.server.controller');

module.exports = function(app) {
  // Feedbackcards Routes
  app.route('/api/feedbackcards').all(feedbackcardsPolicy.isAllowed)
    .get(feedbackcards.list)
    .post(feedbackcards.create);

  app.route('/api/feedbackcards/:feedbackcardId').all(feedbackcardsPolicy.isAllowed)
    .get(feedbackcards.read)
    .put(feedbackcards.update)
    .delete(feedbackcards.delete);

  // Finish by binding the Feedbackcard middleware
  app.param('feedbackcardId', feedbackcards.feedbackcardByID);
};
