'use strict';

describe('Controller: HanoiCtrl', function () {

  // load the controller's module
  beforeEach(module('haksGamesApp'));

  var HanoiCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HanoiCtrl = $controller('HanoiCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HanoiCtrl.awesomeThings.length).toBe(3);
  });
});
