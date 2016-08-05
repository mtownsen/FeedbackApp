(function () {
  'use strict';

  angular
    .module('feedbackcards')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Feedbackcards',
      state: 'feedbackcards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'feedbackcards', {
      title: 'List Feedbackcards',
      state: 'feedbackcards.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'feedbackcards', {
      title: 'Create Feedbackcard',
      state: 'feedbackcards.create',
      roles: ['user']
    });
  }
})();
