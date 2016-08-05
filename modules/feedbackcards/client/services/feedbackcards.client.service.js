//Feedbackcards service used to communicate Feedbackcards REST endpoints
(function () {
  'use strict';

  angular
    .module('feedbackcards')
    .factory('FeedbackcardsService', FeedbackcardsService);

  FeedbackcardsService.$inject = ['$resource'];

  function FeedbackcardsService($resource) {
    return $resource('api/feedbackcards/:feedbackcardId', {
      feedbackcardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
