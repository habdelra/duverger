import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import chartConstants from '../../../utils/chart-constants';

moduleFor('route:application');

test('it returns a district model', function(){
  expect(1);

  var expectedModel = {
    formulaName: 'majority',
    districtNumber: 1,
    districtName: 'District 1',
    formulae: [{
      value: 'majority',
      display: 'Majority'
    },{
      value: 'plurality',
      display: 'Plurality'
    }],
    preferenceGroups: ['group'],
    diameter: chartConstants().height
  };

  var route = this.subject({
    _getFixtureData: function() {
      return expectedModel;
    }
  });

  var actualModel = route.model();
  deepEqual(actualModel, expectedModel, 'the model is correct');
});
