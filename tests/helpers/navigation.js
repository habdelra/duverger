
import Ember from 'ember';

var registerAsyncHelper = Ember.Test.registerAsyncHelper;

var majorityFormulaSelector = '.formula-btn.majority';
var runoffSelector = '.election-nav-btn.view-runoff';

registerAsyncHelper('navigateToMajorityRunoff', function(app, districtUrl) {
  var click = app.testHelpers.click;

  return visit(districtUrl)
    .then(function() {
      return click(majorityFormulaSelector);
    })
    .then(function() {
      return click(runoffSelector);
    });
});
