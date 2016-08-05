'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Feedbackcard Schema
 */
var FeedbackcardSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Feedbackcard name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Feedbackcard', FeedbackcardSchema);
