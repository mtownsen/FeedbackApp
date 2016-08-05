'use strict';

describe('Feedbackcards E2E Tests:', function () {
  describe('Test Feedbackcards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/feedbackcards');
      expect(element.all(by.repeater('feedbackcard in feedbackcards')).count()).toEqual(0);
    });
  });
});
