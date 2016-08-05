(function () {
  'use strict';

  // Feedbackcards controller
  angular
    .module('feedbackcards')
    .controller('FeedbackcardsController', FeedbackcardsController);

  FeedbackcardsController.$inject = ['$scope', '$state', 'Authentication', 'feedbackcardResolve'];

  function FeedbackcardsController ($scope, $state, Authentication, feedbackcard) {
    var vm = this;

    vm.authentication = Authentication;
    vm.feedbackcard = feedbackcard;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Feedbackcard
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.feedbackcard.$remove($state.go('feedbackcards.list'));
      }
    }

    // Save Feedbackcard
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.feedbackcardForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.feedbackcard._id) {
        vm.feedbackcard.$update(successCallback, errorCallback);
      } else {
        vm.feedbackcard.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('feedbackcards.view', {
          feedbackcardId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
