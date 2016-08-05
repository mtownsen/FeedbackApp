'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Feedbackcard = mongoose.model('Feedbackcard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Feedbackcard
 */
exports.create = function(req, res) {
  var feedbackcard = new Feedbackcard(req.body);
  feedbackcard.user = req.user;

  feedbackcard.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedbackcard);
    }
  });
};

/**
 * Show the current Feedbackcard
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var feedbackcard = req.feedbackcard ? req.feedbackcard.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  feedbackcard.isCurrentUserOwner = req.user && feedbackcard.user && feedbackcard.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(feedbackcard);
};

/**
 * Update a Feedbackcard
 */
exports.update = function(req, res) {
  var feedbackcard = req.feedbackcard ;

  feedbackcard = _.extend(feedbackcard , req.body);

  feedbackcard.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedbackcard);
    }
  });
};

/**
 * Delete an Feedbackcard
 */
exports.delete = function(req, res) {
  var feedbackcard = req.feedbackcard ;

  feedbackcard.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedbackcard);
    }
  });
};

/**
 * List of Feedbackcards
 */
exports.list = function(req, res) { 
  Feedbackcard.find().sort('-created').populate('user', 'displayName').exec(function(err, feedbackcards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedbackcards);
    }
  });
};

/**
 * Feedbackcard middleware
 */
exports.feedbackcardByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Feedbackcard is invalid'
    });
  }

  Feedbackcard.findById(id).populate('user', 'displayName').exec(function (err, feedbackcard) {
    if (err) {
      return next(err);
    } else if (!feedbackcard) {
      return res.status(404).send({
        message: 'No Feedbackcard with that identifier has been found'
      });
    }
    req.feedbackcard = feedbackcard;
    next();
  });
};
