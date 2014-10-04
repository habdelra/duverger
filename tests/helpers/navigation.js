
import Ember from 'ember';

var registerAsyncHelper = Ember.Test.registerAsyncHelper;

var formulaSelectSelector = '.formula select';
var majorityFormulaOptionSelector = 'option';
var runoffSelector = '.election-nav-btn.view-runoff';

function selectDropdownOption(optionIndex) {
  return function() {
    var select = find(formulaSelectSelector);
    var option = select.find(majorityFormulaOptionSelector)[optionIndex];

    $(option).prop('selected', true);
    triggerEvent(select[0], 'change');
  };
}

registerAsyncHelper('navigateToMajorityRunoff', function(app, districtUrl) {
  var click = app.testHelpers.click;

  return visit(districtUrl)
    .then(selectDropdownOption(1))
    .then(function() {
      return click(runoffSelector);
    });
});

registerAsyncHelper('navigateToPlurality', function(app, districtUrl) {
  var click = app.testHelpers.click;

  return visit(districtUrl)
    .then(selectDropdownOption(2));
});
