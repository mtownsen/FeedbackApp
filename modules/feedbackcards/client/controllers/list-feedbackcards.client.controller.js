(function () {
  'use strict';

  angular
    .module('feedbackcards')
    .controller('FeedbackcardsListController', FeedbackcardsListController);

  FeedbackcardsListController.$inject = ['FeedbackcardsService'];

  function FeedbackcardsListController(FeedbackcardsService) {
    var vm = this;

    vm.feedbackcards = FeedbackcardsService.query();
  }
})();
