(function () {
  'use strict';

  angular
    .module('feedbackcards')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('feedbackcards', {
        abstract: true,
        url: '/feedbackcards',
        template: '<ui-view/>'
      })
      .state('feedbackcards.list', {
        url: '',
        templateUrl: 'modules/feedbackcards/client/views/list-feedbackcards.client.view.html',
        controller: 'FeedbackcardsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Feedbackcards List'
        }
      })
      .state('feedbackcards.create', {
        url: '/create',
        templateUrl: 'modules/feedbackcards/client/views/form-feedbackcard.client.view.html',
        controller: 'FeedbackcardsController',
        controllerAs: 'vm',
        resolve: {
          feedbackcardResolve: newFeedbackcard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Feedbackcards Create'
        }
      })
      .state('feedbackcards.edit', {
        url: '/:feedbackcardId/edit',
        templateUrl: 'modules/feedbackcards/client/views/form-feedbackcard.client.view.html',
        controller: 'FeedbackcardsController',
        controllerAs: 'vm',
        resolve: {
          feedbackcardResolve: getFeedbackcard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Feedbackcard {{ feedbackcardResolve.name }}'
        }
      })
      .state('feedbackcards.view', {
        url: '/:feedbackcardId',
        templateUrl: 'modules/feedbackcards/client/views/view-feedbackcard.client.view.html',
        controller: 'FeedbackcardsController',
        controllerAs: 'vm',
        resolve: {
          feedbackcardResolve: getFeedbackcard
        },
        data:{
          pageTitle: 'Feedbackcard {{ articleResolve.name }}'
        }
      });
  }

  getFeedbackcard.$inject = ['$stateParams', 'FeedbackcardsService'];

  function getFeedbackcard($stateParams, FeedbackcardsService) {
    return FeedbackcardsService.get({
      feedbackcardId: $stateParams.feedbackcardId
    }).$promise;
  }

  newFeedbackcard.$inject = ['FeedbackcardsService'];

  function newFeedbackcard(FeedbackcardsService) {
    return new FeedbackcardsService();
  }
})();
