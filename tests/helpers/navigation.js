import Ember from 'ember';

var registerAsyncHelper = Ember.Test.registerAsyncHelper;

var toggleFormulaListButtonSelector = '.toggle-formula-list-button';
var formulaButtonsSelector = '.select-formula-button';
var runoffSelector = '.election-nav-btn.view-runoff';

function selectFromDropDown(buttonIndex) {
  return function() {
    click(toggleFormulaListButtonSelector);
    var formulaButtons = find(formulaButtonsSelector);
    return click(formulaButtons[buttonIndex]);
  };
}

registerAsyncHelper('navigateToMajorityRunoff', function(app, districtUrl) {
  var click = app.testHelpers.click;

  return visit(districtUrl)
    .then(selectFromDropDown(1))
    .then(function() {
      return click(runoffSelector);
    });
});

registerAsyncHelper('navigateToMajority', function(app, districtUrl) {
  var click = app.testHelpers.click;

  return visit(districtUrl)
    .then(selectFromDropDown(1));
});
