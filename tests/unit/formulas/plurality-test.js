import { test, moduleFor } from 'ember-qunit';
import plurality from '../../../formulas/plurality';

module('formula:plurality');

test('winner in plurality formula', function() {
  expect(1);

  var voterData = [{
    voters: 10,
    preferences: [{
      party: 'republican'
    }]
  },{
    voters: 20,
    preferences: [{
      party: 'democrat'
    }]
  },{
    voters: 5,
    preferences: [{
      party: 'green'
    }]
  }];

  var expected = [{
    parties: ['democrat'],
    voterSummary: [{
      green: 5
    },{
      republican: 10
    },{
      democrat: 20
    }]
  }];

  var actual = plurality(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});

test('tie in plurality formula', function() {
  expect(1);

  var voterData = [{
    voters: 20,
    preferences: [{
      party: 'republican'
    }]
  },{
    voters: 20,
    preferences: [{
      party: 'democrat'
    }]
  },{
    voters: 5,
    preferences: [{
      party: 'green'
    }]
  }];

  var expected = [{
    parties: [],
    voterSummary: [{
      green: 5
    },{
      republican: 20
    },{
      democrat: 20
    }]
  }];

  var actual = plurality(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});
