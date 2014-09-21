import { test, moduleFor } from 'ember-qunit';
import districtOneFixture from '../../../models/district-one-fixture';

module('model:district-one-fixture');

test('the initial district 1 model data is correct', function(){
  expect(1);

  var expected = {
    districtNumber: 1,
    districtName: 'District 1',
    preferenceGroups: [{
      voters: 30,
      preferences: [{
        index: 0,
        party: 'socialDemocrat'
      },{
        index: 1,
        party: 'conservative'
      },{
        index: 2,
        party: 'green'
      },{
        index: 3,
        party: 'nationalist'
      },{
        index: 4,
        party: 'liberal'
      }]
    },{
      voters: 10,
      preferences: [{
        index: 0,
        party: 'liberal'
      },{
        index: 1,
        party: 'socialDemocrat'
      },{
        index: 2,
        party: 'conservative'
      },{
        index: 3,
        party: 'green'
      },{
        index: 4,
        party: 'nationalist'
      }]
    },{
      voters: 20,
      preferences: [{
        index: 0,
        party: 'nationalist'
      },{
        index: 1,
        party: 'liberal'
      },{
        index: 2,
        party: 'socialDemocrat'
      },{
        index: 3,
        party: 'conservative'
      },{
        index: 4,
        party: 'green'
      }]
    },{
      voters:20,
      preferences: [{
        index: 0,
        party: 'green'
      },{
        index: 1,
        party: 'nationalist'
      },{
        index: 2,
        party: 'liberal'
      },{
        index: 3,
        party: 'socialDemocrat'
      },{
        index: 4,
        party: 'conservative'
      }]
    },{
      voters: 20,
      preferences: [{
        index: 0,
        party: 'conservative'
      },{
        index: 1,
        party: 'green'
      },{
        index: 2,
        party: 'nationalist'
      },{
        index: 3,
        party: 'liberal'
      },{
        index: 4,
        party: 'socialDemocrat'
      }]
    }]
  };

  deepEqual(districtOneFixture(), expected, 'the model is correct');
});
