import { test, moduleFor } from 'ember-qunit';
import plurality from '../../../formulas/plurality';

var originalRandomFunction;

module('formula:plurality',{
  setup: function() {
    originalRandomFunction = Math.random;
    //need to fake randomness so that we can make deterministic assertions in the tests
    Math.random = function() {
      return 0;
    };
  },
  teardown: function() {
    Math.random = originalRandomFunction;
  }
});

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
    winners: ['democrat'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: "green",
      republican: "republican",
      democrat: "democrat"
    },
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
  expect(2);

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
    winners: ['democrat'],
    coinToss: {
      participants: ['republican', 'democrat'],
      winners: ['democrat']
    },
    votedFor: {
      green: "green",
      republican: "republican",
      democrat: "democrat"
    },
    voterSummary: [{
      green: 5
    },{
      republican: 20
    },{
      democrat: 20
    }]
  }];

  actual = plurality(voterData);
  deepEqual(actual, expected, 'the formula is correct');

  Math.random = function() {
    return 0.99;
  };

  expected = [{
    winners: ['republican'],
    coinToss: {
      participants: ['republican', 'democrat'],
      winners: ['republican']
    },
    votedFor: {
      green: "green",
      republican: "republican",
      democrat: "democrat"
    },
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
